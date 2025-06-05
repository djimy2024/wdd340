// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")


// Route to build inventory by classification view
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validator")
const invValidation = require("../utilities/inventory-validator")


// Get inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// MANAGEMENT VIEW
router.get("/", utilities.handleErrors(invController.buildManagement))

// ADD CLASSIFICATION VIEW
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// PROCESS ADD CLASSIFICATION FORM (POST)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addClassification)
)

// ADD INVENTORY VIEW
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// PROCESS ADD INVENTORY FORM (POST)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addInventory)
)


router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildItemDetailView))

router.get("/Error Link", (req, res, next) => {
  try {
    throw new Error("This is an intentional 500 error for testing purposes.")
  } catch (error) {
    next(error)
  }
})

// Route to build the edit inventory item view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

router.post(
  "/update",
  invValidation.newInventoryRules(),
  invValidation.checkUpdateData,
  invValidate.inventoryRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router;
