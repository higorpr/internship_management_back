import { ApplicationError } from "../../protocols";

export function InternshipNotFound(): ApplicationError {
	return {
		name: "Internship Not Found",
		message: "Estágio não encontrado.",
		status: 404,
	};
}

export function EarlyInternshipError(startDate: string): ApplicationError {
	return {
		name: "Early Internship Error",
		message: `Não é permitido criar um estágio antes da data de início desta turma, criada em ${startDate}`,
		status: 401,
	};
}
