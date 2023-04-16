import { AuthenticatedRequest } from "../middleware/auth-middleware";
import { Response } from "express";
import { reportService } from "../services/report-service";

export async function gradeReport(req: AuthenticatedRequest, res: Response) {
	const { reportId, reportStatus } = req.body;
	const userId = req.userId;

	try {
		await reportService.checkIfTeacher(userId);
		const updatedReport = await reportService.updateReportStatus(
			reportId,
			reportStatus
		);
		return res.status(200).send(updatedReport);
	} catch (err) {
		if (err.name !== "Error") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}

export async function sendReportEmail(
	req: AuthenticatedRequest,
	res: Response
) {
	try {
		const to = "higorpr@gmail.com";
		const subject = "Teste de envio de email com pdf";
		const message = "Espero que tenha dado certo";
		const file = req.files[0];
		console.log(file);
		const mailConfirmation = await reportService.sendReportByEmail(
			to,
			subject,
			message,
			file
		);
		if (mailConfirmation) {
			reportService.deleteFile(file);
		}
		return res.status(200).send(mailConfirmation);
		// return res.status(200).send(file);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
}
