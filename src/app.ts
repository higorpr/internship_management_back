import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routers";

dotenv.config();
const app = express();

app.use(json())
	.use(cors())
	.get("/health", (req, res) => res.send("OK!"))
	.use("/auth", authRouter);

export default app;
