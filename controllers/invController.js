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
  const nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildItemDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const item = await invModel.getInventoryItemById(inv_id);
    let nav = await utilities.getNav();
    const title = `${item.inv_year} ${item.inv_make} ${item.inv_model}`;
    res.render("inventory/detail", {
      title,
      nav,
      detail: item
    });
  } catch (error) {
    next(error);
  }
}

  module.exports = invCont