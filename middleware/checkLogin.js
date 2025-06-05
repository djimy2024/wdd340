module.exports = function (req, res, next) {
  if (req.session.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}
