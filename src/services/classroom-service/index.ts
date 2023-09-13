import { classes } from "@prisma/client";
import { nanoid } from "nanoid";
import {
	classInfo,
	classroomRepository,
	completeClassInfo,
} from "../../repositories/classroom-repository";
import { userRepository } from "../../repositories/user-repository";
import { reportService } from "../report-service";
import {
	frontEndBadRequestError,
	inactiveClassError,
	inexistentClassError,
	mustBeTeacherError,
	sameClassNameError,
	studentAlreadyEnrolledError,
} from "./errors";

async function getAllClasses(ownerId: number): Promise<classes[]> {
	const allClasses = await classroomRepository.getAllClasses(ownerId);
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
	classType: string,
	ownerId: number
): Promise<classes> {
	const classCode: string = createRandomClassCode();
	const classTypeId = await getClassTypeId(classType);
	if (!classTypeId) {
		throw frontEndBadRequestError();
	}

	const sameClassName = await repeatedClassName(name);
	if (sameClassName) {
		throw sameClassNameError();
	}

	await teacherCheck(ownerId);

	const startDateFormatted = new Date(startDate);
	const endDateFormatted = new Date(endDate);
	const newClass = await classroomRepository.postNewClass(
		name,
		startDateFormatted,
		endDateFormatted,
		classCode,
		classTypeId,
		ownerId
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

function createRandomClassCode(): string {
	const code = nanoid(6);
	return code;
}

async function getClassTypeId(classType: string): Promise<number> {
	const idObj = await classroomRepository.getClassTypeIdByName(classType);
	const id = idObj.id;
	return id;
}

async function getClassInfoFromCode(classCode: string): Promise<classInfo> {
	const classInfo = await classroomRepository.getClassByCode(classCode);
	if (!classInfo) {
		throw inexistentClassError();
	}

	if (classInfo.is_active === false) {
		throw inactiveClassError();
	}

	return classInfo;
}

async function isAlreadyEnrolled(
	userId: number,
	classId: number
): Promise<boolean> {
	const enrollmentCheck = await userRepository.getIfStudentIsEnrolled(
		userId,
		classId
	);

	if (enrollmentCheck) {
		return true;
	}

	return false;
}

async function enrollStudent(
	userId: number,
	classCode: string
): Promise<{ classId: number; className: string }> {
	const classInfo = await getClassInfoFromCode(classCode);

	const classId = classInfo.id;

	if (await isAlreadyEnrolled(userId, classId)) {
		throw studentAlreadyEnrolledError();
	}

	// create entry at user_class table
	await userRepository.createStudentHistory(userId, classId);

	// create entry at reports table
	await reportService.createInitialReports(
		userId,
		classId,
		classInfo.class_type.number_reports
	);

	return { classId: classInfo.id, className: classInfo.name };
}

async function getClassesByIdList(idList: number[]): Promise<classes[]> {
	const studentClasses = await classroomRepository.getStudentClassesInfo(
		idList
	);

	return studentClasses;
}

async function getClassById(classId: number) {
	return await classroomRepository.getClassById(classId);
}

function formatClassInfo(classInfo: completeClassInfo) {
	const formattedClassInfo = { ...classInfo };

	const studentReportInfo = classInfo.user_class.map((studentInfo) => {
		const studentId = studentInfo.users.id;
		const studentName = studentInfo.users.name;
		let reportOneStatus = "";
		let reportTwoStatus = "";
		let reportThreeStatus = "";
		studentInfo.users.reports.forEach((report) => {
			if (report.report_number === 1) {
				reportOneStatus = report.report_status.name;
			}

			if (report.report_number === 2) {
				reportTwoStatus = report.report_status.name;
			}

			if (report.report_number === 3) {
				reportThreeStatus = report.report_status.name;
			}
		});
		return {
			studentId,
			studentName,
			reportOneStatus,
			reportTwoStatus,
			reportThreeStatus,
		};
	});

	delete formattedClassInfo.user_class;
	formattedClassInfo["students"] = studentReportInfo;
	return formattedClassInfo;
}

async function getCompleteClassInfo(classId: number) {
	const classInfo = await classroomRepository.getCompleteClassInfo(classId);

	const formattedClassInfo = formatClassInfo(classInfo);

	return formattedClassInfo;
}

async function getOwnerInfo(classId: number) {
	const ownerInfo = await classroomRepository.getOwnerInfo(classId);
	const selectedInfo = {
		id: ownerInfo.id,
		name: ownerInfo.name,
		email: ownerInfo.email,
	};

	return selectedInfo;
}

export const classroomService = {
	getAllClasses,
	teacherCheck,
	createNewClass,
	enrollStudent,
	getClassesByIdList,
	getClassById,
	getCompleteClassInfo,
	getOwnerInfo,
};
