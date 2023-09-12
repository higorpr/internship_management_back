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
import sgMail from "@sendgrid/mail";

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

	// Check if user has already validated email
	let validatedEmail = true;
	const emailValidated = await isValidatedEmail(email);

	if (emailValidated === false) {
		validatedEmail = false;
		const confirmationObj = await getConfirmationCode(email);
		const confirmationCode =
			confirmationObj.usermail_confirmation[0].confirmation_code;

		sendConfirmationCodeEmail(email, confirmationCode);

		return { validatedEmail: validatedEmail, userInfo: {} };
	}

	const token = createSession(user.id); // Generate token based on userId

	const userOutput = {
		validatedEmail: validatedEmail,
		userInfo: { user, token },
	};

	return userOutput; // Send user info to user
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

async function isValidatedEmail(email: string): Promise<boolean> {
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
	email: string,
	confirmationCode: string
): Promise<usermail_confirmation> {
	const userInfo = await getUserInfoByEmail(email);
	const userConfirmationInfo =
		await authRepository.getUsermailConfirmationInfo(userInfo.id);

	if (userConfirmationInfo.confirmation_code !== confirmationCode) {
		throw wrongConfirmationCodeError();
	}

	if (userConfirmationInfo.is_confirmed === true) {
		throw alreadyConfirmedEmailError();
	}

	const mailConfirmation = await authRepository.confirmValidEmail(
		userInfo.id
	);
	return mailConfirmation;
}

async function sendConfirmationCodeEmail(
	useremail: string,
	confirmationCode: string
) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const content = `Seu código de acesso à Plataforma de Controle de Relatórios de Estágio é: ${confirmationCode} `;

	const email = {
		to: useremail,
		from: process.env.FROM_EMAIL,
		subject: "Plataforma de Controle de Relatórios - Código de Acesso",
		text: content,
	};

	const mail = await sgMail.send(email);

	return mail;
}

async function getConfirmationCode(email: string): Promise<{
	name: string;
	usermail_confirmation: {
		confirmation_code: string;
		user_id: number;
	}[];
}> {
	return await authRepository.getUserConfirmationCodeByEmail(email);
}

async function getUserByEmail(email: string) {
	const user = await getUserInfoByEmail(email);
	if (!user) {
		throw userNotRegisteredError();
	}
	return user;
}

async function sendNewPasswordLink(user: UserReturn) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const token = createSession(user.id);
	const subject =
		"Redefinição de Senha - Plataforma de Controle de Relatórios de Estágio";

	const htmlContent = `
	<h1>Pedido de Alteração de Senha</h1>
	<p>Foi requisitada a alteração da senha de acesso do usuário ${user.name}.</p> 
	<p>Para alterar a senha, acesso o <a href="https://plataformadeestagio.vercel.app/newpassword/${token}">link</a>,
	que tem validade de 1 (um) dia</p>
	<p>Caso não tenha sido você a requisitar essa mudança de senha, por favor ignore esse e-mail.</p>
	`;

	const email = {
		to: user.email,
		from: process.env.FROM_EMAIL,
		subject: subject,
		html: htmlContent,
	};

	const mail = await sgMail.send(email);

	return mail;
}

export const authService = {
	createUser,
	login,
	validateEmail,
	isValidatedEmail,
	sendConfirmationCodeEmail,
	getConfirmationCode,
	getUserByEmail,
	sendNewPasswordLink,
};
