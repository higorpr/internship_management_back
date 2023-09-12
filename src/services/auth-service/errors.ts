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

export function wrongConfirmationCodeError(): ApplicationError {
	return {
		name: 'Wrong Confirmation Code Error',
		message: 'O código de confirmação está incorreto',
		status: 401
	}
}

export function alreadyConfirmedEmailError(): ApplicationError {
	return {
		name: 'Already Confirmed Email Error',
		message: 'Esse e-mail já foi confirmado',
		status: 409
	}
}

export function userNotRegisteredError(): ApplicationError {
	return {
		name: 'User Not Registered Error',
		message: 'Esse usuário não consta no banco de dados',
		status: 404
	}
}

