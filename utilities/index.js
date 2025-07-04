const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
//console.log(data)


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildVehicleDetail = function(data) {
  let formattedPrice = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.inv_price)
  let formattedMiles = new Intl.NumberFormat("en-US").format(data.inv_miles)

  let detail = `
    <div class="vehicle-detail">
      <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
      <div class="vehicle-info">
        <h2>${data.inv_make} ${data.inv_model} (${data.inv_year})</h2>
        <p><strong>Price:</strong> ${formattedPrice}</p>
        <p><strong>Miles:</strong> ${formattedMiles}</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
      </div>
    </div>
  `
  return detail
}


/* **************************************
 * Build the classification dropdown HTML
 * Accepts optional selectedId to preselect
 *************************************** */
Util.getClassificationDropdown = async function (selectedId = null) {
  const data = await invModel.getClassifications()
  let dropdown = `<option value="">Choose a Classification</option>`
  data.rows.forEach(row => {
    dropdown += `<option value="${row.classification_id}"`
    if (selectedId && row.classification_id == selectedId) {
      dropdown += " selected"
    }
    dropdown += `>${row.classification_name}</option>`
  })
  return dropdown
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util

