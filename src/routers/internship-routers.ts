import { Router } from "express";
import createInternship, {
	serviceTest,
} from "../controllers/internship-controller";
import { authentication } from "../middleware/auth-middleware";

const internshipRouter = Router();

internshipRouter
	.get("/test", serviceTest)
	.all("/*", authentication)
	.post("/newInternship", createInternship);

export { internshipRouter };
