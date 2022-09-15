/*Q1. JS Variable needs to be created here. Below variable is just an example. Try to add more attributes.*/
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
const MAX_AVAILABLE_BOOKINGS = 10;
const SUCCESS_REQUEST = 200;
const INVALID_REQUEST = 400;
const KEY_BOOKING_LIST = "bookingList";
const KEY_USER_SESSION = "userSession";

function NavigationBar() {
  return (
    <nav
      id="navbar"
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{ padding: "10px 20px" }}
    >
      <a className="navbar-brand" href="#">
        Ticket To Ride
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul id="navbar-list" className="navbar-nav mr-auto">
          <li key="nav-home" id="nav-home" className="nav-item">
            <a className="nav-link" href="#">
              Home
            </a>
          </li>
          <li
            key="nav-create-booking"
            id="nav-create-booking"
            className="nav-item"
          >
            <a className="nav-link" href="#">
              Create a booking
            </a>
          </li>
          <li
            key="nav-remove-booking"
            id="nav-remove-booking"
            className="nav-item"
          >
            <a className="nav-link" href="#">
              Remove a booking
            </a>
          </li>
          <li key="nav-show-booking" id="nav-show-booking" className="nav-item">
            <a className="nav-link" href="#">
              Show all bookings
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function TravellerRow(props) {
  const { travellers = [] } = props;
  return (
    <>
      {travellers.map((t) => (
        <tr>
          <td>t.id</td>
          <td>t.name</td>
          <td>t.phone</td>
          <td>t.bookingTime</td>
        </tr>
      ))}
    </>
  );
}

function Display(props) {
  /*Q3. Write code to render rows of table, reach corresponding to one traveller. Make use of the TravellerRow function that draws one row.*/

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          {/*Q3. Below table is just an example. Add more columns based on the traveller attributes you choose.*/}
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Booking Time</th>
        </tr>
      </thead>
      <tbody>
        {/*Q3. write code to call the JS variable defined at the top of this function to render table rows.*/}
      </tbody>
    </table>
  );
}

class Add extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    /*Q4. Fetch the passenger details from the add form and call bookTraveller()*/
    if (!e.target.name.value || !e.target.phone.value) return;
    this.props.bookTraveller({
      name: e.target.name.value,
      phone: e.target.phone.value,
    });
  }

  render() {
    return (
      <form name="addTraveller" onSubmit={this.handleSubmit}>
        {/*Q4. Placeholder to enter passenger details. Below code is just an example.*/}
        <input type="text" name="name" placeholder="Name" />
        <input type="text" name="phone" placeholder="PhoneNumber" />
        <button>Add</button>
      </form>
    );
  }
}

class Delete extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    /*Q5. Fetch the passenger details from the deletion form and call deleteTraveller()*/
  }

  render() {
    return (
      <form name="deleteTraveller" onSubmit={this.handleSubmit}>
        {/*Q5. Placeholder form to enter information on which passenger's ticket needs to be deleted. Below code is just an example.*/}
        <input type="text" name="travellername" placeholder="Name" />
        <button>Delete</button>
      </form>
    );
  }
}

class Homepage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        {/*Q2. Placeholder for Homepage code that shows free seats visually.*/}
      </div>
    );
  }
}
class TicketToRide extends React.Component {
  constructor() {
    super();
    this.state = { travellers: [], selector: 1 };
    this.bookTraveller = this.bookTraveller.bind(this);
    this.deleteTraveller = this.deleteTraveller.bind(this);
  }

  setSelector(value) {
    /*Q2. Function to set the value of component selector variable based on user's button click.*/
  }
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      this.setState({ travellers: initialTravellers });
    }, 500);
  }

  bookTraveller(passenger) {
    /*Q4. Write code to add a passenger to the traveller state variable.*/
    createBooking(passenger.name, passenger.phone);
  }

  deleteTraveller(passenger) {
    /*Q5. Write code to delete a passenger from the traveller state variable.*/
    cancelBooking(passenger);
  }
  render() {
    return (
      <div>
        {/*Q2. Code for Navigation bar. Use basic buttons to create a nav bar. Use states to manage selection.*/}
        <div>
          <NavigationBar />
        </div>
        <div>
          {/*Only one of the below four divisions is rendered based on the button clicked by the user.*/}
          <Add bookTraveller={this.bookTraveller} />
          {/*Q2 and Q6. Code to call Instance that draws Homepage. Homepage shows Visual Representation of free seats.*/}
          {/*Q3. Code to call component that Displays Travellers.*/}

          {/*Q4. Code to call the component that adds a traveller.*/}
          {/*Q5. Code to call the component that deletes a traveller based on a given attribute.*/}
        </div>
      </div>
    );
  }
}

const element = <TicketToRide />;

ReactDOM.render(element, document.getElementById("contents"));

/** GETTER AND SETTER FUNCTIONS **/
/** GET Function
 * Get current amount of total Bookings
 * @returns {number} totalSeats - total number of seats
 * **/
const getBookingList = () => {
  return JSON.parse(getCookie(KEY_BOOKING_LIST)) ?? [];
};

/** GET Function
 * Get current amount of total Bookings
 * @returns {number} totalSeats - total number of seats
 * **/
const getTotalBookings = () => {
  return JSON.parse(getCookie(KEY_BOOKING_LIST))?.length ?? 0;
};

/** GET Function
 * Get available seats left for reservation
 * @returns {number} totalSeatsLeft - total number of available seats left
 * **/
const getAvailableSeats = () => {
  const totalSeats = getTotalBookings() ?? 0;
  return MAX_AVAILABLE_BOOKINGS - totalSeats;
};

/** POST Function
 * Cancel a reservation
 * @returns {number} totalSeatsLeft - total number of available seats left
 * **/
const createBooking = (name, number) => {
  if (!name) return INVALID_REQUEST;
  if (!number) return INVALID_REQUEST;
  // increase booking count
  const newTotalBookings = getTotalBookings() + 1;
  if (newTotalBookings > MAX_AVAILABLE_BOOKINGS) return 0;
  const newBookingList = JSON.stringify([
    { id: new Date().getTime(), name, number, timeStamp: new Date() },
    ...getBookingList(),
  ]);
  console.debug("[POST] Create new booking", newBookingList);
  setCookie(KEY_BOOKING_LIST, newBookingList);
  return SUCCESS_REQUEST;
};

/** POST Function
 * Create new reservation
 * @returns {number} totalSeatsLeft - total number of available seats left
 * **/
const cancelBooking = (id) => {
  if (!id) return INVALID_REQUEST;
  // increase booking count
  const existingBooking = getTotalBookings();
  if (existingBooking) {
    const newBookingList = JSON.stringify(
      Object.values(getBookingList()).filter((value) => {
        return parseInt(value.id) !== parseInt(id);
      })
    );
    console.debug("[POST] Cancelled", id);
    setCookie(KEY_BOOKING_LIST, newBookingList);
    return SUCCESS_REQUEST;
  }
};

/** User Function **/
function getUserSession() {
  return JSON.parse(getCookie(KEY_USER_SESSION)) ?? { page: null };
}

function updateUserSession(field, value) {
  const previousUserSession = getUserSession();
  setCookie(
    KEY_USER_SESSION,
    JSON.stringify({ ...previousUserSession, [field]: value })
  );
}

// Cookie functions
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
  if (window.location.origin === "file://") {
    window.localStorage.setItem(name, value);
  }
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  if (window.location.origin === "file://") {
    return window.localStorage.getItem(name);
  }
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  if (window.location.origin === "file://") {
    return window.localStorage.removeItem(name);
  }
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
