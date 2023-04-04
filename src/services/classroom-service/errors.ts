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

export function inactiveClassError(): ApplicationError {
	return {
		name: "Inactive Class Error",
		message: "A turma está inativa",
		status: 404,
	};
}

export function inexistentClassError(): ApplicationError {
	return {
		name: "Inexistent Class Error",
		message: "Não há turmas com esse código",
		status: 404,
	};
}

export function studentAlreadyEnrolledError(): ApplicationError {
	return {
		name: "Student Already Enrolled Error",
		message: "O aluno já está matriculado nessa turma",
		status: 409,
	};
}
