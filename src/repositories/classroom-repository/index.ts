import { prisma } from "../../config/db";
import { classes, class_type } from "@prisma/client";

type UserType = { user_types: { name: string } };

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

async function postNewClass(
	className: string,
	startDate: Date,
	endDate: Date,
	classCode: string,
	classTypeId: number
): Promise<classes> {
	return await prisma.classes.create({
		data: {
			name: className,
			is_active: true,
			start_date: startDate,
			end_date: endDate,
			class_code: classCode,
			background_color: "#000000",
			class_type_id: classTypeId,
		},
	});
}

async function getClassTypeIdByName(
	classType: string
): Promise<{ id: number }> {
	return await prisma.class_type.findFirst({
		where: {
			name: classType,
		},
		select: {
			id: true,
		},
	});
}

async function getClassByName(className: string): Promise<{ name: string }> {
	return await prisma.classes.findFirst({
		where: {
			name: className,
		},
	});
}

export type classInfo = classes & { class_type: class_type };

async function getClassByCode(classCode: string): Promise<classInfo> {
	return await prisma.classes.findFirst({
		where: {
			class_code: classCode,
		},
		include: {
			class_type: true,
		},
	});
}

async function getStudentClassesInfo(idList: number[]): Promise<classes[]> {
	return await prisma.classes.findMany({
		where: {
			id: { in: idList },
		},
	});
}

export const classroomRepository = {
	getAllClasses,
	getUserType,
	postNewClass,
	getClassTypeIdByName,
	getClassByName,
	getClassByCode,
	getStudentClassesInfo,
};
