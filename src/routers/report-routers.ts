import { Router } from "express";
import { authentication } from "../middleware/auth-middleware";
import { sendReportEmail, gradeReport } from "../controllers/report-controller";
import multer from "multer";
import path from "path";

const reportRouter = Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../uploads/"));
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

reportRouter
	.all("/*", authentication)
	.put("/reportStatus", gradeReport)
	.post("/sendReport", upload.array("files"), sendReportEmail);

export { reportRouter };
