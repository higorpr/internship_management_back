import {
	StudentInClassData,
	userRepository,
} from "../../repositories/user-repository";
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
	const formData = formatStudentClassData(studentData);

	return formData;
}

function formatStudentClassData(unformattedData: StudentInClassData) {
	const formattedData = { ...unformattedData };
	const reportObj = {};
	unformattedData.reports.forEach((reportData) => {
		let reportOrder = "";
		if (reportData.report_number === 1) {
			reportOrder = "firstReport";
		}
		if (reportData.report_number === 2) {
			reportOrder = "secondReport";
		}
		if (reportData.report_number === 3) {
			reportOrder = "thirdReport";
		}
		reportObj[reportOrder] = {
			deliveredDate: reportData.delivery_date,
			dueDate: reportData.due_date,
			reportStatus: reportData.report_status.name,
		};
	});
	const userData = {
		studentName: unformattedData.name,
		studentStatus: unformattedData.user_class[0].student_status.name,
	};

	delete formattedData.reports;
	delete formattedData.name;
	delete formattedData.user_class;
	formattedData["studentInfo"] = userData;
	formattedData["reportInfo"] = reportObj;

	return formattedData;
}

export const userService = { getStudentClassIds, getStudentDataOnClass };
