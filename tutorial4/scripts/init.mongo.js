/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

try {
  db.createUser({
    user: "root",
    pwd: "abc123",
    roles: [{ role: "root", db: "tickettoride" }],
  });
} catch (err) {
  console.log(err);
}

const TRAVELLER_COLLECTION = "travellers";
const BLACKLIST_COLLECTION = "blacklist";

db.travellers.remove({});
db.blacklist.remove({});

/*Q1. Enter the code for adding the initial list of Travellers here.
 * Create a list of Travellers with necessary fields.
 * Enter the list of travellers into the DB collection named 'travellers'.
 * */

function collectionSanityCheck(collectionName) {
  if (!collectionName) throw "[Error] collectionName not defined";
  if (
    !db
      .getCollectionInfos()
      .filter((collection) => collection.name === collectionName).length
  ) {
    console.log(`[Info] ${collectionName} collection not found, creating...`);
    db.createCollection(collectionName);
    console.log(`[Info] ${collectionName} collection creation successful`);
  }
  console.log(`[Info] ${collectionName} collection sanity check pass`);
}

collectionSanityCheck(TRAVELLER_COLLECTION);
collectionSanityCheck(BLACKLIST_COLLECTION);

const initialTravellers = [
  {
    id: 1,
    name: "Jack",
    phone: 88885555,
    bookingTime: new Date(),
  },
  {
    id: 2,
    name: "Rose",
    phone: 88884444,
    bookingTime: new Date(),
  },
];

db.travellers.insert(initialTravellers);

/*Q1 code ends here*/

const count = db.travellers.count();
print("Inserted", count, TRAVELLER_COLLECTION);

//The _id below is just a placeholder. The below collection, in fact, has only one row and one column. We can denote this by any name but we call this fixedindex.
db.counters.remove({ _id: "fixedindex" });
db.counters.insert({ _id: "fixedindex", current: count });

db.travellers.createIndex({ id: 1 }, { unique: true });
db.travellers.createIndex({ name: 1 });
db.travellers.createIndex({ phone: 1 });
db.travellers.createIndex({ bookingTime: 1 });