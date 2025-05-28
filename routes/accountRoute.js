const express = require("express");
const router = express.Router();

// Controllers & Utilities
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route: Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route: Process Login Attempt
router.post(
  "/login",
  regValidate.loginRules,
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
);

// Route: Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route: Process Registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Export router
module.exports = router;
