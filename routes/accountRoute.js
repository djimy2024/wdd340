const express = require("express");
const router = express.Router();

// Controller & utilities
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  regValidate.loginRules,          
  regValidate.checkLoginData,      
  utilities.handleErrors(accountController.loginAccount) 
)


/* Process the login attempt
router.post("/login", (req, res) => {
  res.status(200).send("login process")
})*/


// Route for layout the registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Export the router
module.exports = router;
