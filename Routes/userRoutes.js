import express from "express";
import {
  registerUserValidator,
  loginUserValidator,
} from "../utils/userValidator.js";
import { userLogin, userRegister } from "../Controllers/userController.js";

const router = express.Router();

router.post("/register", registerUserValidator, userRegister);

router.post("/login", loginUserValidator, userLogin);

export default router;
