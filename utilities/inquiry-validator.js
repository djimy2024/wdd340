import { body } from "express-validator";

export const validateInquiry = [
  body("customer_name").trim().notEmpty().withMessage("Name required."),
  body("customer_email").isEmail().withMessage("Valid email required."),
  body("message").trim().notEmpty().withMessage("Message required."),
];
