import "dotenv/config";
import express from "express";
const app = express();

import cors from "cors";
import DbConnect from "./Config/DbConnect.js";

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes import
import userRoutes from "./Routes/userRoutes.js";
import courseRoutes from "./Routes/courseRoutes.js";

// routes
app.use("/auth", userRoutes);
app.use("/courses", courseRoutes);

// index test endpoint
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello" });
});

// app listen
app.listen(process.env.PORT, () => {
  console.log(`Server Started at Port: ${process.env.PORT}`);
  DbConnect();
});
