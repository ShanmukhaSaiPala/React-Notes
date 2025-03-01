import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js";
import { verifyToken } from "./utils/verifyUser.js";
import { connectDB } from "./utils/connectDB.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/note", verifyToken, noteRouter);

app.listen(PORT, () => {
  console.log("hello from server", process.env.FRONTEND_URL)
  console.log("Server is running on port", PORT);
  connectDB();
});
