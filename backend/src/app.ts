import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "../src/routers/auth.route";
import userRouter from "../src/routers/user.route";
import propertyRouter from "../src/routers/property.route";
import favouriteRouter from "../src/routers/favourite.route";

dotenv.config();

const app = express();

const _APP_PORT = process.env.APP_PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", propertyRouter);
app.use("/api", favouriteRouter);

app.get("/", (req, res) => {
  res.json("Welcome to WiseAI API v1");
});

app.listen(_APP_PORT, () => {
  try {
    console.log(`Server is running at http://localhost:${_APP_PORT}`);
  } catch (error) {
    console.log("Server has some error:", error);
  }
});
