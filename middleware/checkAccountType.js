module.exports = function (req, res, next) {
  if (!req.session.loggedin || !req.session.account_type) {
    req.flash("notice", "You must be logged in to access this page.")
    return res.redirect("/account/login")
  }

  const allowedTypes = ["Employee", "Admin"]
  if (!allowedTypes.includes(req.session.account_type)) {
    req.flash("notice", "You do not have permission to access this page.")
    return res.redirect("/account/login")
  }

  next()
}
