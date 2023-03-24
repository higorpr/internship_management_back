import { users } from "@prisma/client";
import jwt from "jsonwebtoken";
import authRepository from "../../repositories/auth-repository";
import { duplicatedEmailError, invalidLoginInfoError } from "./errors";
import bcrypt from "bcrypt";

async function createUser(
	name: string,
	email: string,
	password: string
): Promise<users> {
	// Check if email is not registered in the database
	await validateUniqueEmail(email);

	const userTypeId = await getUserTypeId(email);

	const hashPassword = await bcrypt.hash(password, 12);

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

async function login(email: string, password: string) {
	const user = await getUserInfoByEmail(email); // Get user based on email

	const hashPassword = user.password;

	await validatePassword(password, hashPassword); // Compare sent password to hashed password

	const token = createSession(user.id); // Generate token based on userId

	return token; // Send token to controller
}

async function getUserInfoByEmail(email: string) {
	const user = await authRepository.getUserByEmail(email);
	if (!user) {
		throw invalidLoginInfoError();
	}

	return user;
}

async function validatePassword(password: string, hashPassword: string) {
	const passwordCheck = await bcrypt.compare(password, hashPassword);
	if (!passwordCheck) {
		throw invalidLoginInfoError();
	}
}

function createSession(userId: number) {
	const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
		expiresIn: 86400,
	}); // token will expire in 1 day
	return token;
}

export const authService = { createUser, login };
