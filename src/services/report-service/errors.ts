import { ApplicationError } from "../../protocols";

export function mustBeTeacherError(): ApplicationError {
	return {
		name: "Must Be Teacher Error",
		message: "The user must be a teacher to complete this action",
		status: 401,
	};
}
