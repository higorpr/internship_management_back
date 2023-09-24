import { classes, reports } from "@prisma/client";
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
import * as XLSX from "xlsx";

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
	// formattedClassInfo["students"].sort((a, b) =>
	// 	a.studentName.localCompare(b.studentName)
	// );

	formattedClassInfo["students"] = sortStringList(
		formattedClassInfo["students"],
		"studentName"
	);
	return formattedClassInfo;
}

function sortStringList(strList: string[], field: string): string[] {
	strList.sort((a, b) => {
		const fa = a[field].toLowerCase();
		const fb = b[field].toLowerCase();

		if (fa < fb) {
			return -1;
		}
		if (fa > fb) {
			return 1;
		}
		return 0;
	});
	return strList;
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

async function getReportInfo(classId: number) {
	const reportInfo = await classroomRepository.getClassReportInfo(classId);
	return reportInfo;
}

async function createReport(classId: number) {
	// Get class report info
	const reportInfo = await getReportInfo(classId);

	// Create spreadsheet
	const wb = XLSX.utils.book_new();

	// Create array to hold sheet information
	const sheetArray: string[][] = [];

	// Generate fixed rows
	const emptyRow = [""];
	const firstRow = [
		"SUPERVISÃO ESTÁGIO",
		"Legenda",
		"AGUARDANDO - EM DIA",
		"ENTREGUE",
		"ATRASADO",
		"APROVADO",
		"RECUSADO",
	];
	const titleRow = [
		"Nome",
		"Local de Estágio",
		"Data de Início do Estágio",
		"Horas Semanais",
		"Data Prevista - Relatório 1",
		"Entrega Efetiva - Relatório 1",
		"Status",
		"Data Prevista - Relatório 2",
		"Entrega Efetiva - Relatório 2",
		"Status",
		"Data Prevista - Relatório 3",
		"Entrega Efetiva - Relatório 3",
		"Status",
	];

	// Push fixed rows to sheet array
	sheetArray.push(firstRow);
	sheetArray.push(emptyRow);
	sheetArray.push(titleRow);

	// Get users in reportInfo
	const usersList = reportInfo.user_class;
	usersList.map((user) => {
		const userRow = generateUserRow(user.users);
		sheetArray.push(userRow);
	});

	const ws = XLSX.utils.aoa_to_sheet(sheetArray);

	XLSX.utils.book_append_sheet(wb, ws, "Estágio Controle Datas");

	console.log(wb);

	return wb;
}

type ReportUserInfo = {
	reports: {
		report_number: number;
		report_status: {
			name: string;
		};
		student_id: number;
		class_id: number;
		is_delivered: boolean;
		status_id: number;
		delivery_date: Date;
		last_version_sent: number;
		due_date: Date;
	}[];
	name: string;
	internships: {
		id: number;
		student_id: number;
		start_date: Date;
		weekly_hours: number;
		class_id: number;
		companies: {
			name: string;
		};
	}[];
};

function generateUserRow(user: ReportUserInfo) {
	const row = ["", "", "", "", "", "", "", "", "", "", "", "", ""];
	row[0] = user.name;

	if (user.internships.length !== 0) {
		row[1] = user.internships[0].companies.name;
		row[2] = user.internships[0].start_date.toLocaleDateString("pt-BR");
		row[3] = `${user.internships[0].weekly_hours}h`;
	} else {
		row[1] = "SEM ESTÁGIO";
		row[2] = "SEM ESTÁGIO";
		row[3] = "SEM ESTÁGIO";
	}
	row[4] = user.reports[0].due_date
		? user.reports[0].due_date.toLocaleDateString("pt-BR")
		: "";
	row[5] = user.reports[0].delivery_date
		? user.reports[0].delivery_date.toLocaleDateString("pt-BR")
		: "";
	row[6] = portugueseReportStatus(user.reports[0].report_status.name);

	row[7] = user.reports[1].due_date
		? user.reports[1].due_date.toLocaleDateString("pt-BR")
		: "";
	row[8] = user.reports[1].delivery_date
		? user.reports[1].delivery_date.toLocaleDateString("pt-BR")
		: "";
	row[9] = portugueseReportStatus(user.reports[1].report_status.name);

	row[10] = user.reports[2].due_date
		? user.reports[2].due_date.toLocaleDateString("pt-BR")
		: "";
	row[11] = user.reports[2].delivery_date
		? user.reports[2].delivery_date.toLocaleDateString("pt-BR")
		: "";
	row[12] = portugueseReportStatus(user.reports[2].report_status.name);

	return row;
}

function portugueseReportStatus(status: string) {
	switch (status) {
		case "WAITING":
			return "AGUARDANDO - EM DIA";
		case "ACCEPTED":
			return "APROVADO";
		case "REFUSED":
			return "REPROVADO";
		case "LATE":
			return "ATRASADO";
		case "DELIVERED":
			return "ENTREGUE";
		default:
			return "SEM ESTÁGIO";
	}
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
	createReport,
};
