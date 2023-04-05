import { userRepository } from "../../repositories/user-repository";
import { unenrolledStudentError } from "./errors";

async function getStudentClassIds(userId: number) {
	const studentClassesIdsList = await userRepository.getStudentClasses(
		userId
	);

	if (!studentClassesIdsList) {
		throw unenrolledStudentError();
	}

	const studentClassesIds = studentClassesIdsList.map(
		(classEntry) => classEntry.class_id
	);

	return studentClassesIds;
}

export const userService = { getStudentClassIds };
