const express = require("express");
const router = express.Router();

// Controllers & Utilities
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
console.log("buildAccountManagement exists?", typeof accountController.buildAccountManagement);
console.log("accountController exports:", Object.keys(accountController));

const regValidate = require("../utilities/account-validation");
const checkLogin = require("../middleware/checkLogin")
const accountValidation = require("../utilities/account-validation")



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

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

router.get("/logout", accountController.logout)

router.get("/update-account/:accountId", checkLogin, accountController.buildUpdateAccount)

router.post("/update-account",
  checkLogin,
  accountValidation.updateRules(), // validation rules (si w gen yo)
  accountValidation.checkUpdateData, // validation function
  accountController.updateAccount
)

router.get(
  "/update-account/:accountId",
  checkLogin,
  accountController.buildUpdateAccount
)

// Export router
module.exports = router;
