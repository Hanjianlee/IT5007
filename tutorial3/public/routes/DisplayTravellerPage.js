"use strict";

function TravellerRow(props) {
  {
    /*Q3. Placeholder to initialize local variable based on traveller prop.*/
  }
  return /*#__PURE__*/React.createElement("tr", null);
}

function Display(props) {
  /*Q3. Write code to render rows of table, reach corresponding to one traveller. Make use of the TravellerRow function that draws one row.*/
  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Phone"), /*#__PURE__*/React.createElement("th", null, "Booking Time"))), /*#__PURE__*/React.createElement("tbody", null));
}