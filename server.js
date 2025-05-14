const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// Set EJS as view engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Serve static files from "public" folder
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Start the server on port 5500
app.listen(5500, () => {
  console.log("Server running on http://localhost:5500");
});
