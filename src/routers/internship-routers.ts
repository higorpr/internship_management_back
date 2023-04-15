import { Router } from "express";
import {
	createInternship,
	sendReportEmail,
	serviceTest,
} from "../controllers/internship-controller";
import { authentication } from "../middleware/auth-middleware";
import multer from "multer";
// import { upload } from "../middleware/multer-middleware";

const internshipRouter = Router();

const uploads = multer({ dest: "temp/" });

internshipRouter
	.get("/test", serviceTest)
	.all("/*", authentication)
	.post("/newInternship", createInternship)
	.post("/sendReport", uploads.array("files"), sendReportEmail);

export { internshipRouter };
