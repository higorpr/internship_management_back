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
		if (err.name === "Must Be Teacher Error") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}

export async function postClass(req: AuthenticatedRequest, res: Response) {
	// className, startDate, endDate,classCode, backgroundColor, classTypeId
	const { name, startDate, endDate, classType } = req.body;
	try {
		const newClass = await classroomService.createNewClass(
			name,
			startDate,
			endDate,
			classType
		);
		return res.status(201).send(newClass);
	} catch (err) {
		console.log(err);
		if (err.name === "Same Class Name Error") {
			return res.status(err.status).send(err.message);
		}
		if (err.name === "Front-End Bad Request Error") {
			return res.status(err.status).send(err.message);
		}

		return res.status(500).send(err);
	}
}
