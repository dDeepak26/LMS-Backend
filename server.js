import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import DbConnect from "./Config/DbConnect.js";

// routes import
import userRoutes from "./Routes/userRoutes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// routes
app.use("/auth", userRoutes);

// index test endpoint
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello" });
});

// app listen
app.listen(process.env.PORT, () => {
  console.log(`Server Started at Port: ${process.env.PORT}`);
  DbConnect();
});
