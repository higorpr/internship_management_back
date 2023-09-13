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

		await internshipService.checkInternshipStartDate(
			Number(classId),
			formattedStartDate
		);

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
		if (err.name === "Early Internship Error") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}

export async function deleteInternship(
	req: AuthenticatedRequest,
	res: Response
) {
	const { internshipId } = req.params;

	try {
		// Check if internshipId exists in database
		await internshipService.getInternshipById(Number(internshipId));

		// Revert reports linked to the internshipId to initial state (when student enrolls into a class)

		await reportService.revertReportsToInitalState(Number(internshipId));

		// // Delete internship
		const deletedInternship = await internshipService.deleteInternship(
			Number(internshipId)
		);

		return res.status(200).send(deletedInternship);
	} catch (err) {
		if (err.name === "Internship Not Found") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}
