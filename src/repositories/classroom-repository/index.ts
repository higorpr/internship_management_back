import { classes } from "@prisma/client";
import { prisma } from "../../config/db";

export type UserType = { user_types: { name: string } };

async function getAllClasses(): Promise<classes[]> {
	return await prisma.classes.findMany();
}

async function getUserType(userId: number): Promise<UserType> {
	return await prisma.users.findFirst({
		where: {
			id: userId,
		},
		select: {
			user_types: {
				select: {
					name: true,
				},
			},
		},
	});
}

export const classroomRepository = { getAllClasses, getUserType };
