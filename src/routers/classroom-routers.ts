import { Router } from "express";
import {
	sendClassReportInfo,
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
	.get("/classReport/:classId", sendClassReportInfo)
	.post("/new", postClass)
	.post("/newStudent", enrollNewStudent);

export { classroomRouter };
