import { AuthenticatedRequest } from "../middleware/auth-middleware";
import { Response } from "express";
import { classroomService } from "../services/classroom-service";

export async function getAllClasses(req: AuthenticatedRequest, res: Response) {
	const userId = req.userId;
	try {
		await classroomService.teacherCheck(userId);

		const classes = await classroomService.getAllClasses();

		res.status(200).send(classes);
	} catch (err) {
		return res.status(err.status).send(err.message);
	}
}
