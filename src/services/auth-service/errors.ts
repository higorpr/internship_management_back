import { ApplicationError } from "../../protocols";

export function duplicatedEmailError(): ApplicationError {
	return {
		name: "Duplicated Email Error",
		message: "Esse e-mail já está em uso",
		status: 409,
	};
}

export function invalidLoginInfoError(): ApplicationError {
	return {
		name: "Invalid Login Error",
		message: "O e-mail ou a senha estão incorretos",
		status: 401,
	};
}
