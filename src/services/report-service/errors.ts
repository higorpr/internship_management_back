import { ApplicationError } from "../../protocols";

export function mustBeTeacherError(): ApplicationError {
	return {
		name: "Must Be Teacher Error",
		message: "The user must be a teacher to complete this action",
		status: 401,
	};
}

export function notPdfFile(): ApplicationError {
	return {
		name: "Not Pdf File",
		message: "O arquivo enviado deve ser um PDF",
		status: 406,
	};
}
