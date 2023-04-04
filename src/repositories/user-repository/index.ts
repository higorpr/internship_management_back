import { users, user_class } from "@prisma/client";
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
async function updateStudentStatus(
	userId: number,
	statusId: number
): Promise<users> {
	return await prisma.users.update({
		where: {
			id: userId,
		},
		data: {
			student_status_id: statusId,
		},
	});
}

async function createStudentHistory(
	userId: number,
	classId: number
): Promise<user_class> {
	return await prisma.user_class.create({
		data: {
			user_id: userId,
			class_id: classId,
		},
	});
}

async function getIfStudentIsEnrolled(userId: number, classId: number) {
	return await prisma.user_class.findFirst({
		where: {
			user_id: userId,
			class_id: classId,
		},
	});
}

export const userRepository = {
	getStatusIdFromName,
	updateStudentStatus,
	createStudentHistory,
	getIfStudentIsEnrolled,
};
