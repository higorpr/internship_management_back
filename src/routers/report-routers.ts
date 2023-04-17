import { Router } from "express";
import { authentication } from "../middleware/auth-middleware";
import { sendReportEmail, gradeReport } from "../controllers/report-controller";
import multer from "multer";

const reportRouter = Router();

const uploads = multer({ dest: "temp/" });

reportRouter
	.all("/*", authentication)
	.put("/reportStatus", gradeReport)
	.post("/sendReport", uploads.array("files"), sendReportEmail);

export { reportRouter };
