import { classes } from "@prisma/client";
import { nanoid } from "nanoid";
import { classroomRepository } from "../../repositories/classroom-repository";
import {
	frontEndBadRequestError,
	mustBeTeacherError,
	sameClassNameError,
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

export const classroomService = { getAllClasses, teacherCheck, createNewClass };
