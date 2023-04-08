import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JWTPayload = {
	userId: number;
};
export type AuthenticatedRequest = Request & JWTPayload;

export async function authentication(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(400).send("Você deve estar logado para continuar");
	}

	const [schema, token] = authorization.split(" ");

	if (schema !== "Bearer") {
		return res.sendStatus(400);
	}

	try {
		const { userId } = jwt.verify(
			token,
			process.env.JWT_SECRET
		) as JWTPayload;

		req.userId = userId;
	} catch (err) {
		return res.status(401).send("Invalid Token");
	}

	next();
}
