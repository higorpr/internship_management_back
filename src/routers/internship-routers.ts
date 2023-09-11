import { Router } from "express";
import {
	createInternship,
	deleteInternship,
} from "../controllers/internship-controller";
import { authentication } from "../middleware/auth-middleware";

const internshipRouter = Router();

internshipRouter
	.all("/*", authentication)
	.post("/newInternship", createInternship)
	.delete("/delete/:internshipId", deleteInternship);

export { internshipRouter };
