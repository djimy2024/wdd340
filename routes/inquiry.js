const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry-controller');
const { body } = require('express-validator');
const utilities = require("../utilities");


// POST route
router.post('/submit', [
  body('customer_name').notEmpty().trim().escape(),
  body('customer_email').isEmail().normalizeEmail(),
  body('message').notEmpty().trim().escape(),
], inquiryController.submitInquiry);

// GET for admin
router.get('/all', inquiryController.listInquiries);

router.post('/submit', inquiryController.submitInquiry);

// Thank You Page Route
router.get("/thank-you", async (req, res) => {
  const nav = await utilities.getNav();
  res.render("inquiry/thank-you", {
    title: "Thank You",
    nav,
    message: "Your inquiry has been submitted. We’ll contact you shortly!"
  });
});


module.exports = router;
