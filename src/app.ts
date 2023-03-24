import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter, userRouter } from "./routers";
import { authentication } from "./middleware/auth-middleware";

dotenv.config();
const app = express();

app.use(json())
	.use(cors())
	.get("/health", authentication, (req, res) => res.send("OK!"))
	.use("/auth", authRouter)
	.use("/user", userRouter);

export default app;
