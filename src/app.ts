import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
	authRouter,
	classroomRouter,
	internshipRouter,
	userRouter,
} from "./routers";
import { authentication } from "./middleware/auth-middleware";
import { reportRouter } from "./routers/report-routers";

dotenv.config();
const app = express();

app.use(json())
	.use(cors())
	.get("/health", (req, res) => res.send("OK!"))
	.use("/auth", authRouter)
	.use("/user", userRouter)
	.use("/classroom", classroomRouter)
	.use("/internship", internshipRouter)
	.use("/report", reportRouter);

export default app;
