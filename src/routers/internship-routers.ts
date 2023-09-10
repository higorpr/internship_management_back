import { Router } from "express";
import {
	createInternship,
	deleteInternship,
} from "../controllers/internship-controller";
import { authentication } from "../middleware/auth-middleware";

const internshipRouter = Router();

internshipRouter
	.delete("/delete/:internshipId", deleteInternship)
	.all("/*", authentication)
	.post("/newInternship", createInternship);

export { internshipRouter };
