// src/routes/accountRoute.js

const express = require("express");
const router = express.Router();

// Controller & utilities
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// Route for "My Account" page
//router.get("/", utilities.handleErrors(accountController.buildAccount));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", utilities.handleErrors(accountController.loginAccount));

router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", utilities.handleErrors(accountController.registerAccount));

router.post("/register", accountController.registerAccount)


// Export the router
module.exports = router;
