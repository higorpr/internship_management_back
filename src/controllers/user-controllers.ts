import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth-middleware";
import { userService } from "../services/user-service";
import { reportService } from "../services/report-service";

export async function getEnrolledStudentsData(
	req: AuthenticatedRequest,
	res: Response
) {
	const { studentId, classId } = req.params;

	try {
		const studentData = await userService.getStudentDataOnClass(
			Number(studentId),
			Number(classId)
		);

		return res.status(200).send(studentData);
	} catch (err) {
		if (err.name !== "Error") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}

export async function updateStudentStatus(
	req: AuthenticatedRequest,
	res: Response
) {
	const { studentId, classId, studentStatus } = req.body;
	const userId = req.userId;

	try {
		await reportService.checkIfTeacher(userId);
		const updatedStudentStatus = await userService.updateStudentStatus(
			Number(studentId),
			Number(classId),
			studentStatus
		);
		return res.status(200).send(updatedStudentStatus);
	} catch (err) {
		if (err.name !== "Error") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}


