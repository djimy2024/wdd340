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
 const classificationSelect = await utilities.getClassificationDropdown()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: [],
  })
}

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClassification = async (req, res) => {
  const nav = await utilities.buildNav()
  const classificationSelect = await utilities.getClassificationDropdown(itemData.classification_id)
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
    const classificationSelect = await utilities.getClassificationDropdown(itemData.classification_id)
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
 const classificationSelect = await utilities.getClassificationDropdown(itemData.classification_id)
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.buildNav()
    const itemData = await invModel.getInventoryItemById(inv_id)
    const classificationSelect = await utilities.getClassificationDropdown(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    })
  } catch (error) {
    next(error)
  }
}

invCont.updateInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const data = req.body
    const updateResult = await invModel.updateInventory(data)

    if (updateResult) {
      req.flash("message", `The ${data.inv_make} ${data.inv_model} was successfully updated.`)
      res.redirect("/inv")
    } else {
      const nav = await utilities.buildNav()
      const classificationList = await utilities.getClassificationDropdown(data.classification_id)
      res.render("inventory/edit-inventory", {
        title: "Edit " + data.inv_make + " " + data.inv_model,
        nav,
        classificationList,
        errors: [{ msg: "Update failed. Try again." }],
        ...data
      })
    }
  } catch (error) {
    next(error)
  }
}


module.exports = invCont
