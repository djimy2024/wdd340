// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")


// Route to build inventory by classification view
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validator")
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

module.exports = router;
