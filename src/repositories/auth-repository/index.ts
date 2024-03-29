import { users, user_types, usermail_confirmation } from "@prisma/client";
import { prisma } from "../../config/db";

export type UserReturn = {
	id: number;
	name: string;
	email: string;
	password: string;
	user_types: user_types;
};

async function getUserByEmail(email: string): Promise<UserReturn> {
	return await prisma.users.findFirst({
		where: {
			email: email,
		},
		select: {
			id: true,
			name: true,
			email: true,
			password: true,
			user_types: true,
		},
	});
}

async function getUserTypeIdByTypeName(
	typeName: string
): Promise<{ id: number }> {
	return await prisma.user_types.findFirst({
		where: {
			name: typeName,
		},
		select: {
			id: true,
		},
	});
}

async function createNewUser(
	name: string,
	email: string,
	hashPassword: string,
	userTypeId: number
): Promise<users> {
	return prisma.users.create({
		data: {
			name: name,
			email: email,
			password: hashPassword,
			user_type_id: userTypeId,
			documentation_ok: false,
		},
	});
}

async function createEmailConfirmationEntry(
	userId: number,
	confirmationCode: string
): Promise<usermail_confirmation> {
	return await prisma.usermail_confirmation.create({
		data: {
			user_id: userId,
			confirmation_code: confirmationCode,
			is_confirmed: false,
		},
	});
}

async function getUsermailConfirmationInfo(
	userId: number
): Promise<{ confirmation_code: string; is_confirmed: boolean }> {
	return await prisma.usermail_confirmation.findFirst({
		where: {
			user_id: userId,
		},
		select: {
			confirmation_code: true,
			is_confirmed: true,
		},
	});
}

async function confirmValidEmail(
	userId: number
): Promise<usermail_confirmation> {
	return await prisma.usermail_confirmation.update({
		where: {
			user_id: userId,
		},
		data: {
			is_confirmed: true,
		},
	});
}

async function getUserConfirmationCodeByEmail(email: string): Promise<{
	name: string;
	usermail_confirmation: {
		confirmation_code: string;
		user_id: number;
	}[];
}> {
	return await prisma.users.findFirst({
		where: {
			email: email,
		},
		select: {
			name: true,
			usermail_confirmation: {
				select: {
					user_id: true,
					confirmation_code: true,
				},
			},
		},
	});
}

async function updatePassword(
	userId: number,
	hashPassword: string
): Promise<users> {
	return await prisma.users.update({
		where: {
			id: userId,
		},
		data: {
			password: hashPassword,
		},
	});
}

const authRepository = {
	getUserByEmail,
	createNewUser,
	getUserTypeIdByTypeName,
	createEmailConfirmationEntry,
	getUsermailConfirmationInfo,
	confirmValidEmail,
	getUserConfirmationCodeByEmail,
	updatePassword,
};

export default authRepository;
