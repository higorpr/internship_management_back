import { ApplicationError } from "../../protocols";

export function mustBeTeacherError(): ApplicationError {
	return {
		name: "Must Be Teacher Error",
		message: "O usuário deve ser um professor para acessar essa rota.",
		status: 401,
	};
}

export function frontEndBadRequestError(): ApplicationError {
	return {
		name: "Front-End Bad Request Error",
		message: "A requisição não foi feita no formato correto",
		status: 400,
	};
}

export function sameClassNameError(): ApplicationError {
	return {
		name: "Same Class Name Error",
		message: "Já existe uma turma com esse nome",
		status: 409,
	};
}
