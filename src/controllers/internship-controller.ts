import { AuthenticatedRequest } from "../middleware/auth-middleware";
import { Response } from "express";
import { internshipService } from "../services/internship-service";
import { reportService } from "../services/report-service";

export async function createInternship(
	req: AuthenticatedRequest,
	res: Response
) {
	const studentId = req.userId;

	const { companyName, startDate, weeklyHours, classId } = req.body;

	const startDateWithTimezone = startDate + "T00:00:00-03:00";

	try {
		const formattedStartDate = new Date(startDateWithTimezone);

		const internship = await internshipService.postInternship(
			companyName,
			studentId,
			formattedStartDate,
			Number(weeklyHours)
		);

		await internshipService.updateReportForInternshipCreation(
			studentId,
			Number(classId),
			Number(internship.id),
			formattedStartDate,
			Number(weeklyHours)
		);

		return res.status(201).send(internship);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
}

export async function serviceTest(req: AuthenticatedRequest, res: Response) {
	try {
		const intDate = new Date("2023-04-11T00:00:00.000-03:00");
		const dueDates = internshipService.generateDueDates(intDate, 20);
		return res.status(200).send({ dueDates });
	} catch (err) {
		console.log(err);
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
