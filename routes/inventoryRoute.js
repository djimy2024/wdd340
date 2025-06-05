const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validator")
const checkAccountType = require("../middleware/checkAccountType")


// --- PUBLIC ROUTES (pa bezwen login) ---

// Get inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Build item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildItemDetailView))

// Error testing route
router.get("/Error Link", (req, res, next) => {
  try {
    throw new Error("This is an intentional 500 error for testing purposes.")
  } catch (error) {
    next(error)
  }
})

// --- PROTECTED ROUTES (require login with specific account type) ---

// All below routes require logged-in user with proper account type
router.use(checkAccountType)

// MANAGEMENT VIEW
router.get("/", utilities.handleErrors(invController.buildManagement))

// ADD CLASSIFICATION
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addClassification)
)

// ADD INVENTORY
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addInventory)
)

// EDIT INVENTORY
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.updateInventory)
)

// DELETE INVENTORY
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirmation))
router.post("/delete", utilities.handleErrors(invController.deleteInventory))

module.exports = router
