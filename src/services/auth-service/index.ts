import { usermail_confirmation, users } from "@prisma/client";
import jwt from "jsonwebtoken";
import authRepository, { UserReturn } from "../../repositories/auth-repository";
import {
	alreadyConfirmedEmailError,
	duplicatedEmailError,
	invalidLoginInfoError,
	userNotRegisteredError,
	wrongConfirmationCodeError,
} from "./errors";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import { userRepository } from "../../repositories/user-repository";

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

	const nanoid = customAlphabet("1234567890", 6);
	const userConfirmationCode = nanoid();
	await authRepository.createEmailConfirmationEntry(
		newUser.id,
		userConfirmationCode
	);

	return newUser;
}

async function getUserTypeId(email: string): Promise<number> {
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

async function validateUniqueEmail(email: string): Promise<void> {
	const userWithRegisteredEmail = await authRepository.getUserByEmail(email);
	if (userWithRegisteredEmail) {
		throw duplicatedEmailError();
	}
}

async function login(email: string, password: string) {
	const user = await getUserInfoByEmail(email); // Get user based on email

	const hashPassword = user.password;

	await validatePassword(password, hashPassword); // Compare sent password to hashed password

	delete user.password; // remove password from object sent to user

	const token = createSession(user.id); // Generate token based on userId

	return { user, token }; // Send user info to user
}

async function getUserInfoByEmail(email: string): Promise<UserReturn> {
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

async function isValidEmail(email: string): Promise<boolean> {
	const user = await getUserInfoByEmail(email);
	if (!user) {
		throw userNotRegisteredError();
	}
	const mailInfo = await authRepository.getUsermailConfirmationInfo(user.id);
	if (mailInfo.is_confirmed === false) {
		return false;
	}
	return true;
}

async function validateEmail(
	userId: number,
	confirmationCode: string
): Promise<usermail_confirmation> {
	const userConfirmationInfo =
		await authRepository.getUsermailConfirmationInfo(userId);

	if (userConfirmationInfo.confirmation_code !== confirmationCode) {
		throw wrongConfirmationCodeError();
	}

	if (userConfirmationInfo.is_confirmed === true) {
		throw alreadyConfirmedEmailError();
	}

	const mailConfirmation = await authRepository.confirmValidEmail(userId);
	return mailConfirmation;
}

export const authService = { createUser, login, validateEmail, isValidEmail };
