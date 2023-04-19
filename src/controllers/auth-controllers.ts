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
		const token = await authService.login(email, password);
		return res.status(200).send(token);
	} catch (err) {
		if (err.name === "Invalid Login Error") {
			return res.status(401).send(err.message);
		}
		return res.status(500).send(err);
	}
}
