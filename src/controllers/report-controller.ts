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
	const file = req.files[0];
	console.log(`File:`);
	console.log(file)
	const { reportId } = req.body;
	console.log(`ReportId: ${reportId}`);
	// To be used on Version 2
	// const professorId = req.userId;

	// TODO: Add type checking for received file
	try {
		const reportInfo = await reportService.getReportInfo(Number(reportId));

		const to = "higorpr@gmail.com";

		const subject = `Envio do Relatório ${reportInfo.report_number}_V.${
			reportInfo.last_version_sent + 1
		} - Estudante ${reportInfo.users.name}`;

		const message = `Segue anexo o Relatório ${
			reportInfo.report_number
		}_Versão ${reportInfo.last_version_sent + 1} do Estudante ${
			reportInfo.users.name
		}, matriculado em ${
			reportInfo.classes.name
		}. O relatório foi enviado em ${new Date().toLocaleString("pt-BR", {
			timeZone: "America/Sao_Paulo",
		})}.`;

		const mailConfirmation = await reportService.sendReportByEmail(
			to,
			subject,
			message,
			file
		);
		if (mailConfirmation) {
			//FIXME: Remove file deletion
			// reportService.deleteFile(file);
			const updatedReport =
				await reportService.updateReportDeliveryInformation(
					Number(reportId)
				);
			return res.status(200).send(updatedReport);

		}
		// return res.sendStatus(200);
		//FIXME: Why am I sending back the file?
		return res.status(200).send(file); 
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
}
