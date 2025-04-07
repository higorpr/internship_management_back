import { Response, Request } from "express";
import { authService } from "../services/auth-service";

export async function signUp(req: Request, res: Response) {
	const { name, email, password } = req.body;
	try {
		await authService.createUser(name, email, password);
		return res.sendStatus(201);
	} catch (err) {
		if (err.name === "Duplicated Email Error") {
			return res.status(401).send(err.message);
		}
		return res.status(500).send(err);
	}
}

export async function login(req: Request, res: Response) {
	const { email, password } = req.body;

	try {
		const userInfo = await authService.login(email, password);

		return res.status(200).send({ response: userInfo });
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
		return res.sendStatus(202);
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

export async function requestPasswordChange(req: Request, res: Response) {
	const { email }: { email: string } = req.body;
	try {
		// Verificar se o usuário existe a partir do email (e pegar o userId)
		const user = await authService.getUserByEmail(email);

		// Existindo o usuário, enviar o email com o link para alteração de senha.
		await authService.sendNewPasswordLink(user);
		return res.sendStatus(200);
	} catch (err) {
		if (err.name === "User Not Registered Error") {
			return res.status(err.status).send(err.message);
		}
		return res.status(500).send(err);
	}
}

export async function updatePassword(req: Request, res: Response) {
	const { token, password } = req.body;
	try {
		const userId = await authService.getUserIdFromtoken(token);

		await authService.updatePassword(userId, password);

		return res.status(202).send('Senha alterada');
	} catch (err) {
		if (err.name === "Wrong URL Error") {
			return res.status(err.status).send(err.message);
		}
		if (err.name === "TokenExpiredError") {
			return res.status(401).send("A URL não é mais válida");
		}

		return res.status(500).send(err);
	}
}
