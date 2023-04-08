import { ApplicationError } from "../../protocols";

export function unenrolledStudentError(): ApplicationError {
	return {
		name: "Unenrolled Student Error",
		message: "The student is not enrolled in any classes",
		status: 404,
	};
}

export function inexistantUserError(): ApplicationError {
	return {
		name: "Inexistant User Error",
		message: "This id does not correspond to any user",
		status: 404,
	};
}

export function mustBeStudentError(): ApplicationError {
	return {
		name: "Must Be Student Error",
		message: "This user is not a student",
		status: 400,
	};
}

export function studentMustBeEnrolledError(): ApplicationError {
	return {
		name: "Student Must Be Enrolled Error",
		message: "This student is not enrolled in this class",
		status: 401,
	};
}
