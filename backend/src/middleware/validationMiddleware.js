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

module.exports = {
  validateSignup,
};
