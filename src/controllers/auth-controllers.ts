import { Response, Request } from "express";
import { authService } from "../services/auth-service";

export async function signUp(req: Request, res: Response) {
	const { name, email, password } = req.body;
	try {
		await authService.createUser(name, email, password);
		return res.sendStatus(201);
	} catch (err) {
		return res.status(err.status).send(err.message);
	}
}

export async function login(req: Request, res: Response) {
	const { email, password } = req.body;

	try {
		const token = await authService.login(email, password);
		return res.status(200).send(token);
	} catch (err) {
		return res.status(err.status).send(err.message);
	}
}
