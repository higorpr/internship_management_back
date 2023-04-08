import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth-middleware";
import { classroomService } from "../services/classroom-service";
import { userService } from "../services/user-service";

export default async function getEnrolledStudentsData(
	req: AuthenticatedRequest,
	res: Response
) {
	const userId = req.userId;
	const { studentId, classId } = req.params;

	try {
		await classroomService.teacherCheck(userId);

		const studentData = await userService.getStudentDataOnClass(
			Number(studentId),
			Number(classId)
		);

		return res.status(200).send(studentData);
	} catch (err) {
		if (err.name) {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}
