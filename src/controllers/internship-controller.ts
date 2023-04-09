import { AuthenticatedRequest } from "../middleware/auth-middleware";
import { Response } from "express";
import { internshipService } from "../services/internship-service";

export default async function createInternship(
	req: AuthenticatedRequest,
	res: Response
) {
	const studentId = req.userId;

	const { companyName, startDate, weeklyHours } = req.body;

	try {
		const formattedStartDate = new Date(startDate);

		const internship = await internshipService.postInternship(
			companyName,
			studentId,
			formattedStartDate,
			Number(weeklyHours)
		);
		console.log(internship);

		return res.status(201).send(internship);
	} catch (err) {
		if (err.name) {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}
