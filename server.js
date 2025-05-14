const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// View Engine Setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static Files
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// PORT for local and Render
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
