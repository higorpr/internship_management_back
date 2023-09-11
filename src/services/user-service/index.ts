import {
	StudentInClassData,
	userRepository,
} from "../../repositories/user-repository";
import {
	inexistantUserError,
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
			id: reportData.id,
			deliveredDate: reportData.delivery_date,
			dueDate: reportData.due_date,
			reportStatus: reportData.report_status.name,
		};
	});
	const userData = {
		studentName: unformattedData.name,
		studentStatus: unformattedData.user_class[0].student_status.name,
		className: unformattedData.user_class[0].classes.name,
	};

	let internshipData = null;
	if (unformattedData.internships.length !== 0) {
		internshipData = {
			id: unformattedData.internships[0].id,
			companyName: unformattedData.internships[0].companies.name,
			internshipStartDate: unformattedData.internships[0].start_date,
			weeklyHours: unformattedData.internships[0].weekly_hours,
		};
	}

	delete formattedData.reports;
	delete formattedData.name;
	delete formattedData.user_class;
	delete formattedData.internships;

	formattedData["studentInfo"] = userData;
	formattedData["reportInfo"] = reportObj;
	if (internshipData) {
		formattedData["internshipInfo"] = internshipData;
	}

	return formattedData;
}

async function updateStudentStatus(
	studentId: number,
	classId: number,
	studentStatus: string
) {
	// check if userId exists
	const existanceCheck = await studentExists(studentId);
	if (!existanceCheck) {
		throw inexistantUserError();
	}

	// check if student is enrolled
	const enrollmentCheck = await isStudentEnrolled(studentId, classId);
	if (!enrollmentCheck) {
		throw studentMustBeEnrolledError();
	}

	const updatedStatus = await userRepository.updateStudentStatus(
		studentId,
		classId,
		studentStatus
	);

	return updatedStatus;
}

export const userService = {
	getStudentClassIds,
	getStudentDataOnClass,
	isStudent,
	updateStudentStatus,
};
