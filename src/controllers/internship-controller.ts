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
			Number(weeklyHours),
			Number(classId)
		);

		await internshipService.updateReportForInternshipCreation(
			studentId,
			Number(classId),
			Number(internship.id),
			formattedStartDate,
			Number(weeklyHours)
		);

		await reportService.updateReportsIfExpired(Number(classId));

		return res.status(201).send(internship);
	} catch (err) {
		return res.status(500).send(err);
	}
}
