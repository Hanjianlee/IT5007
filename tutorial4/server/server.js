const fs = require("fs");
const express = require("express");
const { ApolloServer, UserInputError } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { MongoClient } = require("mongodb");

let db; //Variable that points to the real DB.

//Resolver1: Query
async function listTravellers() {
  /*Q2: Write code to talk to DB and read the list of travellers
   * */
  console.log("[List] travellers");
  try {
    const travellers = await db
      .collection("travellers")
      .find({
        name: { $exists: true },
        phone: { $exists: true },
        bookingTime: { $exists: true, $type: "date" },
      })
      .toArray();
    return travellers;
  } catch (err) {
    throw err;
  }
  /*End of Q2*/
}

//Resolver2: Mutation
async function addTraveller(_, { ticket }) {
  console.log("[POST] Adding traveller", ticket);

  //Check if travellername is in blacklist
  const blacklisted = await db
    .collection("blacklist")
    .find({ name: ticket.name });

  if (blacklisted) throw "This user has been blacklisted!!";

  async function getNextSequence(name) {
    const result = await db.collection("counters").findOneAndUpdate(
      { _id: name }, //find the entry that matches this _id
      { $inc: { current: 1 } }, //perform the update
      { returnOriginal: false } //do not return the old value, only updated counter value.
    );
    console.log(result);
    return result.value.current;
  }
  ticket.id = await getNextSequence("fixedindex");

  /*Q2: Write code to talk to DB and add a new ticket.
   * Make sure you return the correct value of the correct type as per the schema.*/

  const newTraveller = await db.collection("travellers").findOneAndUpdate(
    { id: ticket.id },
    { $set: ticket },
    {
      upsert: true,
      returnOriginal: false,
    }
  );

  return newTraveller.value;
  /*End of Q2*/
}

/*Resolver3: GraphQL Scalar
//Below function is a GraphQL scalar that defines a valid Date.
//Serialize is used to send back/return a date in string format.
//ParseValue is used to convert all input values that are provided as an input JS variable.
//ParseLiteral is used to convert all input values that are in Int, String, etc. to a JSON-like form that GraphQL understands.
*/
const GraphQLDate = new GraphQLScalarType({
  name: "GraphQLDate",
  description: "A Date() type in GraphQL as a scalar",
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    console.log(value);
    const dateValue = new Date(value);
    return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    }
  },
});

async function deleteTraveller(_, { travellername }) {
  /*Q2: Write code to talk to DB and delete the given passenger.
   * Note: Ensure that the function parameters for deleteTraveller() defined above  matches the
   * schema defined in travellerschema.graphql.*/
  try {
    console.log(travellername);
    const result = await db
      .collection("travellers")
      .findOneAndDelete({ name: travellername });
    console.log("here", result);
    return !!result?.value;
  } catch (err) {
    throw err;
  }
  /*End of Q2*/
}

/*Q4: Placeholder for blacklistTraveller() resolver.
 * This function should accept a traveller name and add them to a collection named blacklist.
 * */
async function addBlacklistTraveller(_, { travellername }) {
  console.log("[POST] Adding Black listed traveller", travellername);

  const newTraveller = await db.collection("blacklist").findOneAndUpdate(
    { name: travellername },
    { $set: { name: travellername } },
    {
      upsert: true,
      returnOriginal: false,
    }
  );
  return newTraveller.value;
}

/*End of Q4*/

const resolvers = {
  Query: {
    listTravellers,
  },
  Mutation: {
    addTraveller,
    deleteTraveller,
    addBlacklistTraveller,
    /*Q4. Make an entry for blacklistTraveller resolver here*/
  },
  GraphQLDate,
};

const app = express();
app.use(express.static("public"));

const server = new ApolloServer({
  typeDefs: fs.readFileSync("./server/travellerschema.graphql", "utf-8"),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});
server.applyMiddleware({ app, path: "/graphql" });

async function connectToDb() {
  // authenticate with authSource +
  const url = "mongodb://root:abc123@127.0.0.1/tickettoride?authSource=admin";
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log("Connected to Ticket To Ride MongoDB at", url);
  db = client.db();
}

(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log("App started on port 3000");
    });
  } catch (err) {
    console.log("ERROR:", err);
  }
})();
