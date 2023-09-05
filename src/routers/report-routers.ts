import { Router } from "express";
import { authentication } from "../middleware/auth-middleware";
import { sendReportEmail, gradeReport } from "../controllers/report-controller";
import multer from "multer";

const reportRouter = Router();

const upload = multer();

reportRouter
	.all("/*", authentication)
	.put("/reportStatus", gradeReport)
	.post("/sendReport", upload.array("files"), sendReportEmail);

export { reportRouter };
