import { ApplicationError } from "../../protocols";

export function InternshipNotFound(): ApplicationError {
	return {
		name: "Internship Not Found",
		message: "Internship not found on database.",
		status: 404,
	};
}
