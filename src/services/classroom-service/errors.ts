import { ApplicationError } from "../../protocols";

export function mustBeTeacherError(): ApplicationError {
	return {
		name: "Must Be Teacher Error",
		message: "O usuário deve ser um professor para acessar essa rota.",
		status: 401,
	};
}
