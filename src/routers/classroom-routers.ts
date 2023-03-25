import { Router } from "express";
import { getAllClasses } from "../controllers/classroom-controllers";
import { authentication } from "../middleware/auth-middleware";

const classroomRouter = Router();

classroomRouter.all("/*", authentication).get("/all", getAllClasses);

export { classroomRouter };
