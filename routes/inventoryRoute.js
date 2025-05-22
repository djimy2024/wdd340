// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
const utilities = require("../utilities")

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
