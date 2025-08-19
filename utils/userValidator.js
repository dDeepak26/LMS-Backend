import { body } from "express-validator";

const registerUserValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full Name is Required")
    .isLength({ min: 3 })
    .matches(/^[a-zA-Z]+ [a-zA-Z]+$/)
    .withMessage(
      "Full Name must be at least 3 characters and should only contain letters"
    ),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!()_+=\[{\]};:<>|./?,-]).{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters, with one upperCase, one lowerCase, one number, and one special character"
    ),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role Required")
    .matches(/^(student|instructor)$/)
    .withMessage("Role can be either applicant or employer"),
];

const loginUserValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!()_+=\[{\]};:<>|./?,-]).{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters, with one upperCase, one lowerCase, one number, and one special character"
    ),
];

export { registerUserValidator, loginUserValidator };
