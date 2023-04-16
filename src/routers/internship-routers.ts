import { Router } from "express";
import { createInternship } from "../controllers/internship-controller";
import { authentication } from "../middleware/auth-middleware";

const internshipRouter = Router();

internshipRouter
	.all("/*", authentication)
	.post("/newInternship", createInternship);

export { internshipRouter };
