const { body } = require("express-validator");

const courseValidator = [
  body("name")
    .notEmpty().withMessage("Course name is required")
    .isString().withMessage("Course name must be a string")
    .trim(),

  body("description")
    .notEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be a string")
    .trim(),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isString().withMessage("Category must be a string")
    .trim(),

  body("level")
    .notEmpty().withMessage("Level is required")
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Level must be one of: Beginner, Intermediate, Advanced"),

  body("outcomes")
    .notEmpty().withMessage("Outcomes are required")
    .isString().withMessage("Outcomes must be a string")
    .trim(),

  body("skillsGained")
    .notEmpty().withMessage("Skills gained are required")
    .isString().withMessage("Skills gained must be a string")
    .trim(),

  body("instructor")
    .notEmpty().withMessage("Instructor is required")
    .isString().withMessage("Instructor must be a string")
    .trim()
    ,
  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ gt: 0 }).withMessage("Price must be a number greater than 0"),

  body("discount")
    .optional()
    .isFloat({ min: 0 }).withMessage("Discount must be a positive number or 0"),
];

export default courseValidator;