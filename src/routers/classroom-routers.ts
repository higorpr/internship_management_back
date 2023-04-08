import { Router } from "express";
import {
	enrollNewStudent,
	getAllClasses,
	getSingleClassInfo,
	getStudentClasses,
	postClass,
} from "../controllers/classroom-controllers";
import { authentication } from "../middleware/auth-middleware";

const classroomRouter = Router();

classroomRouter
	.all("/*", authentication)
	.get("/all", getAllClasses)
	.get("/studentClasses", getStudentClasses)
	.get("/singleClassInfo/:classId", getSingleClassInfo)
	.post("/new", postClass)
	.post("/newStudent", enrollNewStudent);

export { classroomRouter };
