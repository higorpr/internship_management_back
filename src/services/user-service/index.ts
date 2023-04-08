import { userRepository } from "../../repositories/user-repository";
import {
	inexistantUserError,
	mustBeStudentError,
	studentMustBeEnrolledError,
	unenrolledStudentError,
} from "./errors";

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

async function isStudent(userId: number) {
	return await userRepository.isStudent(userId);
}

async function studentExists(studentId: number) {
	return await userRepository.studentExists(studentId);
}

async function isStudentEnrolled(studentId: number, classId: number) {
	return await userRepository.isEnrolled(studentId, classId);
}

async function getStudentDataOnClass(studentId: number, classId: number) {
	// check if userId exists
	const existanceCheck = await studentExists(studentId);
	if (!existanceCheck) {
		throw inexistantUserError();
	}

	// check if userId is student
	const studentCheck = await isStudent(studentId);
	if (!studentCheck) {
		throw mustBeStudentError();
	}

	// check if student is enrolled
	const enrollmentCheck = await isStudentEnrolled(studentId, classId);
	if (!enrollmentCheck) {
		throw studentMustBeEnrolledError();
	}

	const studentData = await userRepository.GetStudentClassInfo(
		studentId,
		classId
	);

	return studentData;
}

export const userService = { getStudentClassIds, getStudentDataOnClass };
