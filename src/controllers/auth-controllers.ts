import { Response, Request } from "express";
import { authService } from "../services/auth-service";

export async function signUp(req: Request, res: Response) {
	// recebe um body com:
	// nome, email, senha, confirmação de senha
	// checa se o usuário é professor ou aluno a partir do email
	//
	const { name, email, password } = req.body;
	try {
		const user = await authService.createUser(name, email, password);
		return res.status(201).send(user);
	} catch (err) {
		console.log(err);
	}
}

// export async function login(req: Request, res: Response) {}
