import { ApplicationError } from "../../protocols";

export function duplicatedEmailError(): ApplicationError {
	return {
		name: "Duplicated Email Error",
		message: "Esse e-mail já está em uso",
	};
}
