import { users } from "@prisma/client";
import { hash } from "bcrypt";
import authRepository from "../../repositories/auth-repository";
import { duplicatedEmailError } from "./errors";

async function createUser(
	name: string,
	email: string,
	password: string
): Promise<users> {
	// Check if email is not registered in the database
	await validateUniqueEmail(email);

	const userTypeId = await getUserTypeId(email);

	const hashPassword = await hash(password, 12);

	const newUser = await authRepository.createNewUser(
		name,
		email,
		hashPassword,
		userTypeId
	);

	return newUser;
}

async function getUserTypeId(email: string) {
	const regex = new RegExp(".*@unifeso.edu.br");
	let typeName: string;
	if (regex.test(email)) {
		typeName = "PROFESSOR";
	} else {
		typeName = "STUDENT";
	}
	const typeIdObj = await authRepository.getUserTypeIdByTypeName(typeName);
	return typeIdObj.id;
}

async function validateUniqueEmail(email: string) {
	const userWithRegisteredEmail = await authRepository.getUserByEmail(email);
	if (userWithRegisteredEmail) {
		throw duplicatedEmailError();
	}
}

export const authService = { createUser };
