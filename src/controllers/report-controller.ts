import { AuthenticatedRequest } from "../middleware/auth-middleware";
import { Response } from "express";
import { reportService } from "../services/report-service";
import { classroomService } from "../services/classroom-service";

export async function gradeReport(req: AuthenticatedRequest, res: Response) {
	const { reportId, reportStatus } = req.body;
	const userId = req.userId;

	try {
		await reportService.checkIfTeacher(userId);
		const updatedReport = await reportService.updateReportStatus(
			reportId,
			reportStatus
		);
		await reportService.sendUpdatedReportEmail(Number(reportId));

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
	const { reportId, classId } = req.body;

	try {
		reportService.checkReportFileType(file);

		const reportInfo = await reportService.getReportInfo(Number(reportId));

		const ownerInfo = await classroomService.getOwnerInfo(Number(classId));

		const to = ownerInfo.email;

		const subject = `Envio do Relatório ${reportInfo.report_number}_V.${
			reportInfo.last_version_sent + 1
		} - Estudante ${reportInfo.users.name}`;

		const currentVersion = reportInfo.last_version_sent + 1;

		const message = `Bom dia, professor(a) ${ownerInfo.name}. \n
		\nSegue anexo o Relatório ${
			reportInfo.report_number
		}_Versão ${currentVersion} do Estudante ${
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
			file,
			reportInfo.users.name,
			reportInfo.report_number,
			currentVersion
		);
		if (mailConfirmation) {
			const updatedReport =
				await reportService.updateReportDeliveryInformation(
					Number(reportId)
				);
			return res.status(200).send(updatedReport);
		}
		//FIXME: Why am I sending back the file?
		return res.status(200).send(file);
	} catch (err) {
		if (err.name === "Not Pdf File") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}
