const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.buildNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build item detail view
 * ************************** */
invCont.buildItemDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const item = await invModel.getInventoryItemById(inv_id)
    const nav = await utilities.buildNav()
    const title = `${item.inv_year} ${item.inv_make} ${item.inv_model}`
    res.render("inventory/detail", {
      title,
      nav,
      detail: item,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.buildNav()
  const classificationList = await utilities.getClassificationDropdown()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationList,
    errors: [],
  })
}

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClassification = async (req, res) => {
  const nav = await utilities.buildNav()
  const classificationList = await utilities.getClassificationDropdown()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    classificationList,
    errors: [],
    message: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
    classification_name: ""

  })
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)
try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)
  if (result) {
    req.flash("message", "Classification added successfully.")
    res.redirect("/inv")
  } else {
    const nav = await utilities.buildNav()
    const classificationList = await utilities.getClassificationDropdown()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      classificationList,
      errors: [{ msg: "Failed to add classification." }],
      message: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: "",
      classification_name: ""

    })
  }
}
catch (error) {
    console.error("Error in addClassification:", error)
    next(error)
  }
}

/* ***************************
 *  Build Add Inventory view
 * ************************** */
invCont.buildAddInventory = async (req, res) => {
  const nav = await utilities.buildNav()
  const classificationList = await utilities.getClassificationDropdown()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: [],
    message: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: ""
  })
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async (req, res) => {
  const data = req.body
  const result = await invModel.addInventory(data)

  if (result) {
    req.flash("message", "Inventory item added.")
    res.redirect("/inv")
  } else {
    const nav = await utilities.buildNav()
    const classificationList = await utilities.getClassificationDropdown(data.classification_id)
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: [{ msg: "Failed to add inventory item." }],
      message: null,
      inv_make: data.inv_make,
      inv_model: data.inv_model,
      inv_year: data.inv_year,
      inv_description: data.inv_description,
      inv_image: data.inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: data.inv_thumbnail || "/images/vehicles/no-image.png",
      inv_price: data.inv_price,
      inv_miles: data.inv_miles,
      inv_color: data.inv_color,
      classification_id: data.classification_id
    })
  }
}

module.exports = invCont
