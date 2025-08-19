import { validationResult } from "express-validator";
import { UserModel } from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// user register
const userRegister = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // req body check
    if (!req.body || !fullName || !email || !password || !role) {
      return res.status(400).json({ errMsg: "Missing Fields" });
    }

    // validating req body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    }

    // checking user exists
    const userDb = await UserModel.findOne({ email: email });

    if (userDb) {
      return res.status(409).json({ errMsg: "User Already Registered" });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ msg: "User Registered Successfully" });
  } catch (err) {
    console.error("Error in Registering the User", err);
    res.status(500).json({ errMsg: "Error in Registering the User" });
  }
};

// user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // req body check
    if (!req.body || !email || !password) {
      return res.status(400).json({ errMsg: "Missing Fields" });
    }

    // validating req body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    }

    // checking user exists
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ errMsg: "User Not Found Register First" });
    }

    // password verification
    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res.status(422).json({ errMsg: "Password Not Matched" });
    }

    // signing user & generating jwt token
    const token = await jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      msg: "User Logged Successfully ",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error in Logging the User", err);
    res.status(500).json({ errMsg: "Error in Logging the User" });
  }
};

export { userRegister, userLogin };
