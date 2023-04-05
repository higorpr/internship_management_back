import { AuthenticatedRequest } from "../middleware/auth-middleware";
import { Response } from "express";
import { classroomService } from "../services/classroom-service";
import { userRouter } from "../routers";
import { userService } from "../services/user-service";

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

export async function enrollNewStudent(
	req: AuthenticatedRequest,
	res: Response
) {
	const { classCode } = req.body;
	const userId = req.userId;

	try {
		const targetClass = await classroomService.enrollStudent(
			userId,
			classCode
		);
		return res.status(201).send(targetClass);
	} catch (err) {
		if (err.name === "Student Already Enrolled Error") {
			return res.status(err.status).send(err.message);
		}
		if (err.name === "Inactive Class Error") {
			return res.status(err.status).send(err.message);
		}
		if (err.name === "Inexistent Class Error") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}

export async function getStudentClasses(
	req: AuthenticatedRequest,
	res: Response
) {
	const userId = req.userId;
	try {
		const classIds = await userService.getStudentClassIds(userId);

		const studentClasses = await classroomService.getClassesByIdList(
			classIds
		);

		return res.status(200).send(studentClasses);
	} catch (err) {
		if (err.name === "Unenrolled Student Error") {
			return res.status(err.status).send(err.message);
		}
	}

	return res.status(200);
}
