const utilities = require("../utilities/");
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    message: null,
    errors: null
  });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  
// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      message: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
  title: "Registration",
  nav,
  account_firstname,
  account_lastname,
  account_email,
})
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      req.session.loggedin = true
req.session.account_id = accountData.account_id
req.session.account_firstname = accountData.account_firstname
req.session.account_lastname = accountData.account_lastname
req.session.account_email = accountData.account_email
req.session.account_type = accountData.account_type

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.flash("notice", "You're logged in.")
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ******************************
 *  Deliver Account Management View
 * ******************************/
async function buildAccountManagement(req, res) {
   const accountData = res.locals.accountData
  let nav = await utilities.getNav();
  const messages = req.flash("notice") || [];
  res.render("account/management", {
    title: "Account Management",
    accountData,
    nav,
    message: messages.length > 0 ? messages[0] : "",
    errors: null,
  });
}

const logoutAccount = async (req, res) => {
  try {
    res.clearCookie("jwt")
    req.flash("notice", "You have been logged out.")
    res.redirect("/")
  } catch (error) {
    console.error("Logout failed:", error)
    req.flash("error", "Unable to logout. Please try again.")
    res.redirect("/account")
  }
}


async function buildUpdateAccount(req, res) {
  const accountId = parseInt(req.params.accountId)
  const accountData = await accountModel.getAccountById(accountId)

  res.render("account/update-account", {
    title: "Update Account",
    nav: await utilities.getNav(),
    account: accountData,
    errors: null,
  })
}


async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Account update failed.")
    res.redirect(`/account/update-account/${account_id}`)
  }
}


async function updatePassword(req, res) {
   console.log("Received password update POST request");
  const { password, confirmPassword, accountId } = req.body;
   console.log("Form data:", req.body);
  const errors = [];

  if (!password || password.length < 12) {
    errors.push("Password must be at least 12 characters long.");
  }
  if (password !== confirmPassword) {
    errors.push("Passwords do not match.");
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;
  if (!passwordRegex.test(password)) {
    errors.push("Password must contain at least one uppercase letter, one number, and one special character.");
  }

  if (errors.length > 0) {
    try {
      const accountData = await accountModel.getAccountById(accountId);

      return res.status(400).render("account/update-account", {
        title: "Update Account",
        nav: await utilities.getNav(),
        account: accountData,
        errors: errors
      });
    } catch (err) {
      console.error("Error retrieving account data:", err);
      req.flash("notice", "Something went wrong. Please try again.");
res.redirect("/account/update-account/" + accountId);

    }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await accountModel.updatePassword(accountId, hashedPassword);
    req.flash("notice", "Password updated successfully.");
    res.redirect("/account");
  } catch (err) {
    console.error("Error updating password:", err);
   req.flash("notice", "Something went wrong. Please try again.");
res.redirect("/account/update-account/" + accountId);

  }
}


module.exports = {
  buildLogin,
  loginAccount,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  logoutAccount,
  buildUpdateAccount, updateAccount, updatePassword
};
