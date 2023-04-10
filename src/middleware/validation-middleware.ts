import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

type ValidationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => void;

function validate(schema: ObjectSchema, type: "body" | "params") {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req[type], { abortEarly: false });

		if (!error) {
			next();
		} else {
			const message = error.details.map((err) => err.message);
			res.status(400).send(message);
		}
	};
}

export function bodyValidation(schema: ObjectSchema): ValidationMiddleware {
	return validate(schema, "body");
}

export function paramsValidation(schema: ObjectSchema): ValidationMiddleware {
	return validate(schema, "params");
}
