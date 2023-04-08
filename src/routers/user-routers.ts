import { Router } from "express";
import getEnrolledStudentsData from "../controllers/user-controllers";
import { authentication } from "../middleware/auth-middleware";

const userRouter = Router();

userRouter
	.all("/*", authentication)
	.get("/studentData/:studentId/class/:classId", getEnrolledStudentsData);

export { userRouter };
