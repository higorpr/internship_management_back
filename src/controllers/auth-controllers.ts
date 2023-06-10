import { Response, Request } from "express";
import { authService } from "../services/auth-service";

export async function signUp(req: Request, res: Response) {
	const { name, email, password } = req.body;
	try {
		await authService.createUser(name, email, password);
		return res.sendStatus(201);
	} catch (err) {
		console.log(err);
		if (err.name === "Duplicated Email Error") {
			return res.status(401).send(err.message);
		}
		return res.status(500).send(err);
	}
}

export async function login(req: Request, res: Response) {
	const { email, password } = req.body;

	try {
		let validatedMail = true;
		const emailValidated = await authService.isValidatedEmail(email);

		if (emailValidated === false) {
			validatedMail = false;
			const userInfo = {};

			const confirmationObj = await authService.getConfirmationCode(
				email
			);

			const confirmationCode =
				confirmationObj.usermail_confirmation[0].confirmation_code;

			await authService.sendConfirmationCodeEmail(
				email,
				confirmationCode
			);
			return res
				.status(200)
				.send({ validatedMail: validatedMail, userInfo });
		}

		const userInfo = await authService.login(email, password);

		return res.status(200).send({ validatedMail: validatedMail, userInfo });
	} catch (err) {
		if (err.name === "Invalid Login Error") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}

export async function validateUserEmail(req: Request, res: Response) {
	const { email, confirmationCode } = req.body;
	try {
		await authService.validateEmail(email, confirmationCode);
		return res.status(202).send("E-mail Validado");
	} catch (err) {
		if (err.name === "Wrong Confirmation Code Error") {
			return res.status(err.status).send(err.message);
		}

		if (err.name === "Already Confirmed Email Error") {
			return res.status(err.status).send(err.message);
		}

		return res.status(500).send(err);
	}
}
