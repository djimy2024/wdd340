const jwt = require("jsonwebtoken")

const checkJWT = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      res.locals.loggedIn = true
      res.locals.userData = decoded
    } catch (err) {
      res.locals.loggedIn = false
      res.locals.userData = null
    }
  } else {
    res.locals.loggedIn = false
    res.locals.userData = null
  }
  next()
}

module.exports = checkJWT
