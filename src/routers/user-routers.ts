import { Router } from "express";

import { authentication } from "../middleware/auth-middleware";
import {
	getEnrolledStudentsData,
	updateStudentStatus,
} from "../controllers/user-controllers";

const userRouter = Router();

userRouter
	.all("/*", authentication)
	.get("/studentData/:studentId/class/:classId", getEnrolledStudentsData)
	.put("/studentStatus", updateStudentStatus);

export { userRouter };
