import { ApplicationError } from "../../protocols";

export function unenrolledStudentError(): ApplicationError {
	return {
		name: "Unenrolled Student Error",
		message: "The student is not enrolled in any classes",
		status: 404,
	};
}
