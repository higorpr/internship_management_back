import { users, user_types } from "@prisma/client";
import { prisma } from "../../config/db";

async function getUserByEmail(email: string): Promise<users> {
	return await prisma.users.findFirst({
		where: {
			email: email,
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
