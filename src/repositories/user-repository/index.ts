import { user_class } from "@prisma/client";
import { prisma } from "../../config/db";

async function getStatusIdFromName(status: string): Promise<number> {
	const idObj = await prisma.student_status.findFirst({
		where: {
			name: status,
		},
		select: {
			id: true,
		},
	});
	return idObj.id;
}

async function createStudentHistory(
	userId: number,
	classId: number
): Promise<user_class> {
	const enrolledStatusId = await getStatusIdFromName("ENROLLED");

	return await prisma.user_class.create({
		data: {
			user_id: userId,
			class_id: classId,
			student_status_id: enrolledStatusId,
		},
	});
}

async function getIfStudentIsEnrolled(userId: number, classId: number) {
	const enrolledId = await getStatusIdFromName("ENROLLED");

	return await prisma.user_class.findFirst({
		where: {
			user_id: userId,
			class_id: classId,
			student_status_id: enrolledId,
		},
	});
}

async function getStudentClasses(userId: number): Promise<user_class[]> {
	return await prisma.user_class.findMany({
		where: {
			user_id: userId,
		},
	});
}

export const userRepository = {
	getStatusIdFromName,
	createStudentHistory,
	getIfStudentIsEnrolled,
	getStudentClasses,
};
