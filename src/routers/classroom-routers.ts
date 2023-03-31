import { Router } from "express";
import { getAllClasses, postClass } from "../controllers/classroom-controllers";
import { authentication } from "../middleware/auth-middleware";

const classroomRouter = Router();

classroomRouter
	.all("/*", authentication)
	.get("/all", getAllClasses)
	.post("/new", postClass);

export { classroomRouter };
