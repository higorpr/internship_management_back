import { classes, student_status, users, user_types } from "@prisma/client";
import { prisma } from "../../config/db";

type UserReturn = {
	id: number;
	name: string;
	email: string;
	password: string;
	user_types: user_types;
	classes: classes;
	student_status: student_status;
	documentation_ok: boolean;
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
			classes: true,
			student_status: true,
			documentation_ok: true,
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

const authRepository = {
	getUserByEmail,
	createNewUser,
	getUserTypeIdByTypeName,
};

export default authRepository;
