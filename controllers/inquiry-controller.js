const { validationResult } = require("express-validator");
const { createInquiry, getAllInquiries } = require("../models/inquiry-model");
const utilities = require("../utilities/");

async function submitInquiry(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("errors/error", {
      nav: await utilities.getNav(),
      title: "Validation Error",
      message: "There were errors with your submission.",
      errors: errors.array()
    });
  }

  const { inv_id, customer_name, customer_email, message } = req.body;
  try {
    await createInquiry({ inv_id, customer_name, customer_email, message });
    req.flash("notice", "Inquiry submitted successfully!");
    res.redirect("/inquiry/thank-you");
  } catch (error) {
    console.error("Inquiry insert error:", error);
    res.status(500).render("errors/error", {
      nav: await utilities.getNav(),
      title: "Server Error",
      message: "Something went wrong while submitting your inquiry.",
      errors: [{ msg: error.message }]
    });
  }
}

async function listInquiries(req, res) {
  try {
    const inquiries = await getAllInquiries();
    res.render("inquiry-list", { inquiries });
  } catch (error) {
    console.error("Inquiry fetch error:", error);
    res.status(500).render("errors/error", {
      nav: await utilities.getNav(),
      title: "Server Error",
      message: "Could not retrieve inquiries.",
      errors: [{ msg: error.message }]
    });
  }
}

module.exports = {
  listInquiries,
  submitInquiry
};
