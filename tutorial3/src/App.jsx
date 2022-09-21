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
const PAGES = [
  {
    index: 0,
    sectionId: "total-booking-section",
    title: "Home",
  },
  {
    index: 1,
    sectionId: "create-booking-section",
    title: "Create Booking",
  },
  {
    index: 2,
    sectionId: "cancel-booking-section",
    title: "Cancel Booking",
  },
  {
    index: 3,
    sectionId: "display-booking-section",
    title: "Display Booking List",
  },
];
function NavigationBar(props) {
  const { onClick } = props;
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
          {PAGES.map((page) => (
            <li
              key={`nav-${page.sectionId}`}
              id={`nav-${page.sectionId}`}
              className="nav-item"
              onClick={() => {
                onClick(page.index);
              }}
            >
              <a className="nav-link">{page.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function TravellerRow(props) {
  const { travellers = [], onCancel, showAction = false } = props;
  return (
    <>
      {travellers.map((t) => (
        <tr>
          <td>{t.id}</td>
          <td>{t.name}</td>
          <td>{t.phone}</td>
          <td>{displayBookingTime(t.bookingTime)}</td>
          {showAction && (
            <td>
              <button
                id="cancel-button-${value.id}"
                onClick={() => onCancel(t)}
                className="btn btn-danger"
              >
                Cancel
              </button>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}

function Display(props) {
  /*Q3. Write code to render rows of table, reach corresponding to one traveller. Make use of the TravellerRow function that draws one row.*/

  const { travellers, showAction = false, onCancel } = props;
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        margin: "10px",
      }}
    >
      <div>
        <h2>Booking List</h2>
      </div>
      {travellers && travellers.length ? (
        <table className="bordered-table">
          <thead>
            <tr>
              {/*Q3. Below table is just an example. Add more columns based on the traveller attributes you choose.*/}
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Booking Time</th>
              {showAction && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {/*Q3. write code to call the JS variable defined at the top of this function to render table rows.*/}

            <TravellerRow
              travellers={travellers}
              showAction={showAction}
              onCancel={onCancel}
            />
          </tbody>
        </table>
      ) : (
        <h3 style={{ color: "#C4C4C4" }}>No bookings created yet</h3>
      )}
    </div>
  );
}

class Add extends React.Component {
  constructor() {
    super();
    this.state = { showSuccessAlert: false };
    this.nameInputRef = React.createRef();
    this.phoneInputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    /*Q4. Fetch the passenger details from the add form and call bookTraveller()*/
    if (!e.target.name.value || !e.target.phone.value) return;
    const noOfBookings = getBookingList();
    if (noOfBookings === MAX_AVAILABLE_BOOKINGS) return;
    this.props.bookTraveller({
      name: e.target.name.value,
      phone: e.target.phone.value,
    });
    this.setState({ ...this.state, showSuccessAlert: true });
    this.nameInputRef.current.value = "";
    this.phoneInputRef.current.value = "";
    setTimeout(() => {
      this.setState({ ...this.state, showSuccessAlert: false });
    }, 3000);
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <h2>Create A Booking</h2>
          <form
            name="addTraveller"
            onSubmit={this.handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "400px",
              height: "400px",
              padding: "40px",
              border: "1px solid #000000",
              borderRadius: "0.375rem",
              justifyContent: "center",
            }}
          >
            <h4>Enter Details</h4>
            {/*Q4. Placeholder to enter passenger details. Below code is just an example.*/}
            <div className="input-group mb-3">
              <input
                class="form-control"
                style={{ margin: "10px" }}
                type="text"
                name="name"
                placeholder="Name"
                ref={this.nameInputRef}
              />
            </div>
            <div className="input-group mb-3">
              <input
                class="form-control"
                style={{ margin: "10px" }}
                type="text"
                name="phone"
                placeholder="Phone Number"
                ref={this.phoneInputRef}
              />
            </div>
            <button style={{ margin: "10px" }} className="btn btn-primary">
              Add
            </button>
          </form>
        </div>
        <div
          className="alert alert-success"
          role="alert"
          style={{
            transform: this.state.showSuccessAlert
              ? "translateY(0px)"
              : "translateY(-100vh)",
            transition: "transform 0.3s linear",
          }}
        >
          <h4 className="alert-heading">Well done!</h4>
          <p>You Have successfully create a booking !</p>
        </div>
      </div>
    );
  }
}

class Delete extends React.Component {
  constructor(props) {
    super(props);
    this.state = { travellers: props.travellers ?? [] };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputRef = React.createRef();
    this.deleteTraveller = props.onDelete;
  }

  componentDidUpdate(prevProps) {
    const { travellers } = this.props;
    if (travellers !== prevProps.travellers) {
      this.setState({ ...this.state, travellers });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("submit");
    const targetName = e.target.travellername.value;
    const bookingList = getBookingList();
    const targetTraveller = bookingList.find((t) => t.name === targetName);
    if (targetTraveller) this.deleteTraveller(targetTraveller);
    this.inputRef.current.value = "";
    /*Q5. Fetch the passenger details from the deletion form and call deleteTraveller()*/
    // cancelBooking(id);
  }

  render() {
    const { travellers } = this.state;

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <h2>Cancel a booking</h2>
          <form
            name="deleteTraveller"
            onSubmit={this.handleSubmit}
            style={{ margin: "10px" }}
          >
            {/*Q5. Placeholder form to enter information on which passenger's ticket needs to be deleted. Below code is just an example.*/}
            <div className="input-group mb-3" style={{ width: "400px" }}>
              <input
                ref={this.inputRef}
                type="text"
                className="form-control"
                placeholder="Recipient's username"
                name="travellername"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                disabled={!travellers || !travellers.length}
              />
              <div className="input-group-append">
                <button className="btn btn-danger" type="submit">
                  Delete
                </button>
              </div>
            </div>
          </form>
          {travellers && travellers.length ? (
            <table className="bordered-table">
              <thead>
                <tr>
                  {/*Q3. Below table is just an example. Add more columns based on the traveller attributes you choose.*/}
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Booking Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/*Q3. write code to call the JS variable defined at the top of this function to render table rows.*/}

                <TravellerRow
                  travellers={travellers}
                  showAction={true}
                  onCancel={this.deleteTraveller}
                />
              </tbody>
            </table>
          ) : (
            <h3 style={{ color: "#C4C4C4" }}>No bookings created yet</h3>
          )}
        </div>
      </div>
    );
  }
}

function Seat(props) {
  const { available, size } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        borderRadius: "4px",
        width: size === "small" ? "20px" : "40px",
        height: size === "small" ? "20px" : "40px",
        margin: "10px",
        backgroundColor: !available ? "#C4C4C4" : "lightgreen",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
}

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { travellers: props.travellers ?? [] };
  }
  componentDidUpdate(prevProps) {
    const { travellers } = this.props;
    if (travellers !== prevProps.travellers) {
      this.setState({ ...this.state, travellers });
    }
  }
  render() {
    return (
      <div>
        Home
        {/*Q2. Placeholder for Homepage code that shows free seats visually.*/}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          <h4>Train Seats</h4>
          <div
            style={{
              display: "flex",
              flexDisplay: "column",
              flexWrap: "wrap",
              alignItems: "center",
              border: "1px solid black",
              borderRadius: " 4px",
              minWidth: "100px",
              minHeight: "200px",
              height: "300px",
              maxWidth: "150px",
              padding: "10px",
            }}
          >
            {Array.from(Array(MAX_AVAILABLE_BOOKINGS)).map((_, index) => {
              const foundSeat = this.state.travellers.find(
                (t) => t.id === index + 1
              );
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexBasis: "50%",
                    alignSelf: "center",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  <Seat key={index} available={!foundSeat}>
                    {index + 1}
                  </Seat>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {" "}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <Seat key={"display-1"} size={"small"} available={true} />
              Available
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <Seat key={"display-1"} size={"small"} available={false} />
              Reserved
            </div>
          </div>
        </div>
      </div>
    );
  }
}
class TicketToRide extends React.Component {
  constructor() {
    super();
    this.state = { travellers: [], selector: undefined };
    this.setSelector = this.setSelector.bind(this);
    this.loadData = this.loadData.bind(this);
    this.bookTraveller = this.bookTraveller.bind(this);
    this.deleteTraveller = this.deleteTraveller.bind(this);
  }

  setSelector(value) {
    updateUserSession("page", value);
    this.setState({ ...this.state, selector: value });

    /*Q2. Function to set the value of component selector variable based on user's button click.*/
  }
  componentDidMount() {
    this.loadData();
    this.restoreUserSession();
  }

  loadData() {
    setTimeout(() => {
      console.debug("[Load Booking List]");
      const existingTravellers = getBookingList();
      this.setState({
        ...this.state,
        travellers: existingTravellers ?? initialTravellers,
      });
    }, 500);
  }

  restoreUserSession() {
    setTimeout(() => {
      console.debug("[Restore User Session]");
      const userSession = getUserSession();
      this.setState({ ...this.state, selector: userSession.page ?? 0 });
    }, 500);
  }

  bookTraveller(passenger) {
    /*Q4. Write code to add a passenger to the traveller state variable.*/
    createBooking(passenger.name, passenger.phone);
    console.log("create");
    this.loadData();
  }

  deleteTraveller(passenger) {
    /*Q5. Write code to delete a passenger from the traveller state variable.*/
    cancelBooking(passenger.id);
    this.loadData();
  }
  render() {
    return (
      <div>
        {/*Q2. Code for Navigation bar. Use basic buttons to create a nav bar. Use states to manage selection.*/}
        <div>
          <NavigationBar onClick={this.setSelector} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "20px 20px",
          }}
        >
          {/*Only one of the below four divisions is rendered based on the button clicked by the user.*/}
          {/*Q2 and Q6. Code to call Instance that draws Homepage. Homepage shows Visual Representation of free seats.*/}
          {!this.state.selector && this.state.selector !== 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <h3>Loading Pages...</h3>
              <div className="spinner-border  text-primary" role="status" />
            </div>
          )}
          {this.state.selector === 0 && (
            <Homepage travellers={this.state.travellers} />
          )}
          {this.state.selector === 1 && (
            <Add bookTraveller={this.bookTraveller} />
          )}
          {/*Q3. Code to call component that Displays Travellers.*/}
          {this.state.selector === 2 && (
            <Delete
              onDelete={this.deleteTraveller}
              travellers={this.state.travellers}
            />
          )}
          {/*Q4. Code to call the component that adds a traveller.*/}
          {this.state.selector === 3 && (
            <Display travellers={this.state.travellers} />
          )}
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
const createBooking = (name, phone) => {
  if (!name) return INVALID_REQUEST;
  if (!phone) return INVALID_REQUEST;
  // increase booking count
  const newTotalBookings = getTotalBookings() + 1;
  if (newTotalBookings > MAX_AVAILABLE_BOOKINGS) return 0;
  const newBookingList = JSON.stringify([
    { id: newTotalBookings, name, phone, bookingTime: new Date() },
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

//
function displayBookingTime(date) {
  return new Date(date).toLocaleDateString("en-US");
}
