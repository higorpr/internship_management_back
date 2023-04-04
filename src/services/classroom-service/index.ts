import { classes } from "@prisma/client";
import { nanoid } from "nanoid";
import { classroomRepository } from "../../repositories/classroom-repository";
import { userRepository } from "../../repositories/user-repository";
import {
	frontEndBadRequestError,
	inactiveClassError,
	inexistentClassError,
	mustBeTeacherError,
	sameClassNameError,
	studentAlreadyEnrolledError,
} from "./errors";

async function getAllClasses(): Promise<classes[]> {
	const allClasses = await classroomRepository.getAllClasses();
	return allClasses;
}

async function teacherCheck(userId: number): Promise<void> {
	const userTypePayload = await classroomRepository.getUserType(userId);
	const userType = userTypePayload.user_types.name;

	if (userType !== "PROFESSOR") {
		throw mustBeTeacherError();
	}
}

async function createNewClass(
	name: string,
	startDate: Date,
	endDate: Date,
	classType: string
) {
	// className, startDate, endDate,classCode, backgroundColor, classTypeId
	const classCode: string = createRandomClassCode();
	const classTypeId = await getClassTypeId(classType);
	if (!classTypeId) {
		throw frontEndBadRequestError();
	}

	const sameClassName = await repeatedClassName(name);
	if (sameClassName) {
		throw sameClassNameError();
	}

	const startDateFormatted = new Date(startDate);
	const endDateFormatted = new Date(endDate);
	const newClass = await classroomRepository.postNewClass(
		name,
		startDateFormatted,
		endDateFormatted,
		classCode,
		classTypeId
	);

	return newClass;
}

async function repeatedClassName(className: string) {
	const classNameObj = await classroomRepository.getClassByName(className);
	if (classNameObj) {
		return true;
	}
	return false;
}

function createRandomClassCode() {
	const code = nanoid(6);
	return code;
}

async function getClassTypeId(classType: string): Promise<number> {
	const idObj = await classroomRepository.getClassTypeIdByName(classType);
	const id = idObj.id;
	return id;
}

async function getClassInfoFromCode(classCode: string): Promise<classes> {
	const classInfo = await classroomRepository.getClassByCode(classCode);
	if (!classInfo) {
		throw inexistentClassError();
	}

	if (classInfo.is_active === false) {
		throw inactiveClassError();
	}

	return classInfo;
}

async function isAlreadyEnrolled(userId: number, classId: number) {
	const enrollmentCheck = await userRepository.getIfStudentIsEnrolled(
		userId,
		classId
	);

	if (enrollmentCheck) {
		return true;
	}

	return false;
}

async function enrollStudent(userId: number, classCode: string) {
	const enrolledStatusId = await userRepository.getStatusIdFromName(
		"ENROLLED"
	);
	const classInfo = await getClassInfoFromCode(classCode);

	const classId = classInfo.id;

	if (isAlreadyEnrolled(userId, classId)) {
		throw studentAlreadyEnrolledError();
	}

	await userRepository.createStudentHistory(userId, classId);

	const enrolledStudent = await userRepository.updateStudentStatus(
		userId,
		enrolledStatusId
	);

	return enrolledStudent;
}

export const classroomService = {
	getAllClasses,
	teacherCheck,
	createNewClass,
	enrollStudent,
};
