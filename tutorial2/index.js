/** Global constants **/
const MAX_AVAILABLE_BOOKINGS = 10;
const BOOKING_SESSION_EXPIRY = 60; //seconds
const SUCCESS_REQUEST = 200;
const INVALID_REQUEST = 400;
const KEY_BOOKING_LIST = "bookingList";
const KEY_USER_SESSION = "userSession";
const TEXT_NO_SEATS = "There are no seats available :(";
const TEXT_NO_BOOKINGS = "There are no bookings created, lets create one!";
const TEXT_CREATE_NEW_BOOKING = "Create New Booking"
const BOOKING_FORM_FIELDS = [
    {
        name: "name",
        title: "Name",
        required: true,
        type: "text",
        helperText: "Please enter as per ID Card",
    },
    {
        name: "number",
        title: "Phone Number",
        required: true,
        type: "number",
        helperText: "Please only valid phone number only",
    },
];
const PAGES = [
    {
        index: 0,
        sectionId: "total-booking-section",
        title: "Home",
        loadPage: () => {
            loadHomePage();
        },
    },
    {
        index: 1,
        sectionId: "create-booking-section",
        title: "Create Booking",
        loadPage: () => {
            loadCreateBookingPage();
        },
    },
    {
        index: 2,
        sectionId: "cancel-booking-section",
        title: "Cancel Booking",
        loadPage: () => {
            loadCancelBookingPage();
        },
    },
    {
        index: 3,
        sectionId: "display-booking-section",
        title: "Display Booking List",
        loadPage: () => {
            loadDisplayBookingListPage();
        },
    },
];

/** Effects **/
$(document).ready(function () {
    initialiseApp();
    console.debug(window.location)
});


/**
 * Home Page Total Booking List Effect
 * Displays Total booking list section
 * **/
function loadHomePage() {
    console.debug("[Fetch] Available seats from cookie");
    $("#app-section").append(
        '<div id="total-booking-section" class="section"></div>'
    );
    $("#total-booking-section").append("<H4>Welcome!</H4>");
    document.getElementById('total-booking-section').append(document.createElement('h4',))
    createAvailableSeats();
    createTrainSeating();
}

/**
 * Home Page Total Booking List Effect
 * Displays Total booking list section
 * **/
function loadCreateBookingPage() {
    $("#app-section").append(
        '<div id="create-booking-section"  class="section"></div>'
    );
    $("#create-booking-section").append("<H4>Create a booking</H4>");
    createBookingForm();
    createBookingTimer();
}

/**
 * Cancel With Booking List Effect
 * Displays booking list section
 * **/

function loadCancelBookingPage() {
    console.debug("[Fetch] Booking List from cookie");
    $("#app-section").append(
        '<div id="cancel-booking-section"  class="section"></div>'
    );
    $("#cancel-booking-section").append("<H4>Cancel a booking</H4>");
    createCancelBookingTable();
}

/**
 * Booking List Effect
 * Displays booking list section
 * **/
function loadDisplayBookingListPage() {
    $("#app-section").append(
        '<div id="display-booking-section"  class="section"></div>'
    );
    $("#display-booking-section").append("<H4>Booking List</H4>");
    createBookingListTable();
}

function onPageChange(sectionId) {
    if (!sectionId) return;
    const page = PAGES.find((value) => value.sectionId === sectionId);
    if (!page) return;
    console.debug("[PAGE] loading page ", sectionId);
    $('#app-section').remove()
    $('#body').append('<div id="app-section"></div>')
    window.clearTimeout();
    window.clearInterval(); // Clear booking intervals
    if (page.loadPage) page.loadPage();
    updateUserSession("page", sectionId);
}

function initialiseApp() {
    initialiseNavBar();
    restoreUserSession();
}

function restoreUserSession() {
    const previousUserSession = getUserSession();
    console.debug("[Session]", previousUserSession)
    if (previousUserSession.page) {
        console.debug("[RESTORE] page", previousUserSession.page);
        onPageChange(previousUserSession.page);
    } else {
        onPageChange("total-booking-section");
    }
}

/** UI Function**/

/**
 * Initialise Static Navigation bar
 * **/
function initialiseNavBar() {
    $("#navbar-list").ready(() => {
        $("#nav-loading").css({display: "none"});
        Object.values(PAGES).map((value, index) => {
            $("#navbar-list").append(
                `<li key="nav-create-booking" id="nav-${value.sectionId}" class="nav-item">` +
                `<a class="nav-link" href="#" id="nav-${value.sectionId}">${value.title}</a>` +
                "</li>"
            );
            $(`#nav-${value.sectionId}`).click((e) => {
                e.preventDefault();
                onPageChange(value.sectionId);
            });
        });
    });
}


/**
 * Creates String element
 * **/
function createAvailableSeats() {
    const totalAvailableSeats = getAvailableSeats()
    $("#total-booking-section").append(AVAILABLE_SEATS(totalAvailableSeats));
    if (totalAvailableSeats > 0) {
        $("#total-booking-section").append(
            `<div class="section">` +
            `<button  id="total-booking-section-to-create-booking" class="btn btn-primary">${TEXT_CREATE_NEW_BOOKING}</button>` +
            `</div>`
        );
        $("#total-booking-section-to-create-booking").click((e) => {
            e.preventDefault()
            onPageChange("create-booking-section")
        })
    }
    $("#total-booking-fetch").css({display: "none"});
}

function createTrainSeating() {
    const totalBookings = getTotalBookings();
    $("#total-booking-section").append(`<h5 id="train-seating-section-title">Train Seating</h5>`);
    $("#total-booking-section").append(`<div id="train-seating-section" class="seat-outline-frame"></div>`);
    Array.from(Array(MAX_AVAILABLE_BOOKINGS)).map((_, index) => {
        $("#train-seating-section").append(`<div key=${index} id="seat-frame-${index}" class="seat-frame selected"></div>`)
        if (index <= totalBookings - 1) {
            $(`#seat-frame-${index}`).append(`<div key=${index} id="seat-${index}" class="seat selected"></div>`)
        } else {
            $(`#seat-frame-${index}`).append(`<div key=${index} id="seat-${index}" class="seat"></div>`)
        }
    })

}

function createCancelBookingTable() {
    // Create Table
    $("#cancel-booking-table-section").remove()
    $("#cancel-booking-section").append(
        '<div id="cancel-booking-table-section"></div>'
    );
    // NO VALUE
    const bookingList = getBookingList();
    if (!Object.values(bookingList).length) {
        $("#cancel-booking-table-section").append(
            `<div class="section">` +
            `<span id="no-booking-text">${TEXT_NO_BOOKINGS}</span>` +
            `<button  id="cancel-booking-section-to-create-booking" class="btn btn-primary">${TEXT_CREATE_NEW_BOOKING}</button>` +
            `</div>`
        );
        $("#cancel-booking-section-to-create-booking").click((e) => {
            e.preventDefault()
            onPageChange("create-booking-section")
        })
    }
    Object.values(bookingList).map((value, index) => {
        if (!index) {
            $("#cancel-booking-table-section").append(
                '<table id="cancel-booking-list-table"  class="table">' +
                "<tr>" +
                "<th>No</th>" +
                "<th>Serial No</th>" +
                BOOKING_FORM_FIELDS.map((value) => `<th>${value.title}</th>`).join(
                    ""
                ) +
                "<th>Time Stamp</th>" +
                "<th>Action</th>" +
                "</tr>" +
                "</table>"
            );
        }
        $("#cancel-booking-list-table").append(
            `<tr key="${value.id}">` +
            `<td>${index + 1}</td>` +
            `<td>${value.id}</td>` +
            `<td>${value.name}</td>` +
            `<td>${value.number}</td>` +
            `<td>${value.timeStamp}</td>` +
            `<td><button id="cancel-button-${value.id}" value=${value.id} class="btn btn-danger">Cancel</button></td>` +
            "</tr>"
        );
        $(`#cancel-button-${value.id}`).click((e) => {
            e.preventDefault();
            if (e.currentTarget.value) {
                const result = cancelBooking(e.currentTarget.value);
                createSuccessAlert("cancel-booking-section", "Nice !", `Booking for ${value.name} successfully canceled`)
                if (result === 200) {
                } else {
                    createFailureAlert("cancel-booking-section", "Oh No!", "Looks like there is an issue deleting this list")
                }
            }
            createCancelBookingTable()
        });
    });
    $("#cancel-booking-fetch").css({display: "none"});
}

function createBookingForm() {
    // Create Form
    console.debug("[Fetch] Create booking form");
    $("#create-booking-section").append(
        '<form id="create-booking-form" ></form>'
    );
    $("#create-booking-form").on("submit", (e) => {
        e.preventDefault();
        $("#create-booking-alert-success").remove()
        $("#create-booking-alert-danger").remove()
        createBookingTimer();
        const data = getFormValue("#create-booking-form");
        console.debug("[FORMDATA]", data);
        const status = createBooking(data.name, data.number);
        if (status === 200) {
            BOOKING_FORM_FIELDS.map((value, index) => {
                $(`#${value.name}`).val("");
            });
            createSuccessAlert("create-booking-section", "Well Done !", "Booking Successfully Created")
        } else {
            createFailureAlert("create-booking-section", "Oh No !", "Looks like the booking list is full, you might want to cancel existing bookings")
        }
    });
    BOOKING_FORM_FIELDS.map((value, index) => {
        $("#create-booking-form").append(
            `<div class="input-container" class="form-group">` +
            // `<label>${value.title}</label>` +
            `<input id="${value.name}" class="form-control" name="${value.name}" type="${value.type}" required="${value.required}" placeholder="${value.title}"/>` +
            `<small id="${value.name}-helper" class="form-text text-muted">${value.helperText}</small>` +
            `</div>`
        );
    });
    $("#create-booking-form").append(
        `<button id="create-booking-submit-form" class="btn btn-primary" type="submit">Create Booking</button>`
    );

    $("#create-booking-section").append(
        `<button id="create-booking-to-display-booking" class="btn btn-secondary">View all Bookings</button>`
    );

    $("#create-booking-to-display-booking").click((e) => {
        e.preventDefault();
        onPageChange("display-booking-section")
    })
    $("#create-booking-fetch").css({display: "none"});
}

function createSuccessAlert(id, title, subTitle) {
    $(`#${id}`).append(
        `<div id="${id}-alert-success" class="alert alert-success" role="alert">` +
        `<h4 class="alert-heading">${title}</h4>` +
        `<p>${subTitle}</p>` +
        "</div>"
    );
    setTimeout(() => {
        $(`#${id}-alert-success`).slideUp(300, () => {
            $(this).remove()
        })
    }, 3000)
}

function createFailureAlert(id, title, subTitle) {
    $(`#${id}`).append(
        `<div id="${id}-alert-danger" class="alert alert-danger" role="alert">` +
        `<h4 class="alert-heading">${title}</h4>` +
        `<p>${subTitle}</p>` +
        "</div>"
    );
    setTimeout(() => {
        $(`#${id}-alert-danger`).slideUp(300, () => {
            $(this).remove()
        })
    }, 3000)
}

function createBookingTimer() {
    $("#create-booking-timer").remove()
    const startInterval = (initialIntervalId) => {
        const start = new Date();
        if (initialIntervalId) clearInterval(initialIntervalId);
        console.debug("[INTERVAL] Starting new interval");
        const intervalId = setInterval(function () {
            if (
                (BOOKING_SESSION_EXPIRY - (new Date() - start) / 1000).toFixed(0) <= 0
            ) {
                clearInterval(intervalId);
                $("#bookingTimerModal").modal("show");
            }
        }, 1000);
        $("#create-booking-section").bind("destroyed", () => {
            console.debug("[CLEAR]", clearInterval);
            clearInterval(intervalId);
        });
        return intervalId;
    };
    const initialIntervalId = startInterval();
    $("#create-booking-section").append('<div id="create-booking-timer" ></div>');
    $("#create-booking-timer").append(
        '<div class="modal fade" id="bookingTimerModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" show="true">' +
        '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLabel">Looks like you\'re away</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        "</button>" +
        "</div>" +
        '<div class="modal-body">' +
        "Would you like to create a new booking session ?" +
        "</div>" +
        '<div class="modal-footer">' +
        '<button id="create-booking-timer-decline-button" type="button" class="btn btn-secondary" data-dismiss="modal">Continue Editing</button>' +
        '<button id="create-booking-timer-accept-button" type="button" class="btn btn-primary" >Clear Form</button>' +
        "</div>" +
        " </div>" +
        "</div>" +
        " </div>"
    );
    $("#create-booking-timer-accept-button").click(() => {
        BOOKING_FORM_FIELDS.map((value) => {
            $(`#${value.name}`).val("");
        });
        $("#bookingTimerModal").modal("hide");
    });
    $("#create-booking-timer-decline-button").click(() => {
        startInterval(initialIntervalId);
        $("#bookingTimerModal").modal("hide");
    });
}

function createBookingListTable() {
    console.debug("[Fetch] Booking List from cookie");
    const bookingList = getBookingList();
    // NO VALUE
    if (!Object.values(bookingList).length) {
        $("#display-booking-section").append(
            `<div class="section">` +
            `<span id="no-booking-text">${TEXT_NO_BOOKINGS}</span>` +
            `<button  id="display-booking-section-to-create-booking" class="btn btn-primary">${TEXT_CREATE_NEW_BOOKING}</button>` +
            `</div>`
        );
        $("#display-booking-section-to-create-booking").click((e) => {
            e.preventDefault()
            onPageChange("create-booking-section")
        })
    }
    Object.values(bookingList).map((value, index) => {
        if (!index) {
            $("#display-booking-section").append(
                '<table id="display-booking-list-table" class="table">' +
                "<tr>" +
                "<th>No</th>" +
                "<th>Serial No</th>" +
                BOOKING_FORM_FIELDS.map((value) => `<th>${value.title}</th>`).join(
                    ""
                ) +
                "<th>Time Stamp</th>" +
                "</tr>" +
                "</table>"
            );
        }
        $("#display-booking-list-table").append(
            "<tr>" +
            `<td>${index + 1}</td>` +
            `<td>${value.id}</td>` +
            `<td>${value.name}</td>` +
            `<td>${value.number}</td>` +
            `<td>${value.timeStamp}</td>` +
            "</tr>"
        );
    });
    $("#display-booking-list-fetch").css({display: "none"});
}


/** Booking Functions **/

const AVAILABLE_SEATS = (number) => {
    if (number <= 0 || !number) return TEXT_NO_SEATS;
    return `There are ${number} of seats left`;
};

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
        {id: new Date().getTime(), name, number, timeStamp: new Date()},
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
    return JSON.parse(getCookie(KEY_USER_SESSION)) ?? {page: null};
}

function updateUserSession(field, value) {
    const previousUserSession = getUserSession();
    setCookie(
        KEY_USER_SESSION,
        JSON.stringify({...previousUserSession, [field]: value})
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
    if (window.location.origin === 'file://') {
        window.localStorage.setItem(name, value)
    }
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    if (window.location.origin === 'file://') {
        return window.localStorage.getItem(name)
    }
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    if (window.location.origin === 'file://') {
        return window.localStorage.removeItem(name)
    }
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

//Form functions
function getFormValue(formId) {
    return (
        $(formId)
            .serializeArray()
            .reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {}) ?? {}
    );
}
