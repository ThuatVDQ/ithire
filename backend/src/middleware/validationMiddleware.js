const { body } = require("express-validator");

const validateSignup = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("full_name").notEmpty().withMessage("Full name is not blank"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6"),
  body("retypePassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Retype password is not match"),
];

const validateCompanyCreation = [
  body("name").notEmpty().withMessage("Name is not empty"),
  body("email").isEmail().withMessage("Email is not valid"),
  body("phone").optional().isLength(10).withMessage("Phone must be 10 digits"),
  body("tax_code").notEmpty().withMessage("Tax code cannot be empty"),
];

module.exports = {
  validateSignup,
  validateCompanyCreation,
};
