import { Router } from "express";
import {
	enrollNewStudent,
	getAllClasses,
	getStudentClasses,
	postClass,
} from "../controllers/classroom-controllers";
import { authentication } from "../middleware/auth-middleware";

const classroomRouter = Router();

classroomRouter
	.all("/*", authentication)
	.get("/all", getAllClasses)
	.get("/studentClasses", getStudentClasses)
	.post("/new", postClass)
	.post("/newStudent", enrollNewStudent);

export { classroomRouter };
