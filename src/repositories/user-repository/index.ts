import { user_class, users } from "@prisma/client";
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

async function studentExists(studentId: number): Promise<boolean> {
	const user = await prisma.users.findFirst({
		where: { id: studentId },
	});
	if (user) {
		return true;
	}

	return false;
}

async function isStudent(userId: number): Promise<boolean> {
	const userType = await prisma.users.findFirst({
		where: { id: userId },
		select: {
			user_types: {
				select: {
					name: true,
				},
			},
		},
	});
	if (userType.user_types.name === "STUDENT") {
		return true;
	}

	return false;
}

async function isEnrolled(
	studentId: number,
	classId: number
): Promise<boolean> {
	const enrollCheck = await prisma.user_class.findFirst({
		where: {
			user_id: studentId,
			class_id: classId,
		},
	});

	if (enrollCheck) {
		return true;
	}

	return false;
}

export type StudentInClassData = {
	name: string;
	reports: {
		id: number;
		report_number: number;
		delivery_date: Date;
		due_date: Date;
		report_status: {
			name: string;
		};
	}[];
	internships: {
		id: number;
		start_date: Date;
		weekly_hours: number;
		companies: {
			name: string;
		};
	}[];
	user_class: {
		student_status: {
			name: string;
		};
		classes: {
			name: string;
		};
	}[];
};

async function GetStudentClassInfo(
	studentId: number,
	classId: number
): Promise<StudentInClassData> {
	return await prisma.users.findUnique({
		where: {
			id: studentId,
		},
		select: {
			name: true,
			user_class: {
				where: { class_id: classId },
				select: {
					student_status: {
						select: {
							name: true,
						},
					},
					classes: {
						select: {
							name: true,
						},
					},
				},
			},
			reports: {
				where: {
					class_id: classId,
				},
				select: {
					id: true,
					report_number: true,
					delivery_date: true,
					due_date: true,
					report_status: {
						select: {
							name: true,
						},
					},
				},
			},
			internships: {
				where: {
					class_id: classId,
				},
				select: {
					id: true,
					start_date: true,
					weekly_hours: true,
					companies: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
}

async function updateStudentStatus(
	studentId: number,
	classId: number,
	studentStatus: string
): Promise<user_class> {
	const studentStatusId = await getStatusIdFromName(studentStatus);
	const userClassIdRes = await prisma.user_class.findFirst({
		where: {
			user_id: studentId,
			class_id: classId,
		},
	});
	const userClassId = userClassIdRes.id;

	return await prisma.user_class.update({
		where: {
			id: userClassId,
		},
		data: {
			student_status_id: studentStatusId,
		},
	});
}

async function getUserById(userId: number) {
	return await prisma.users.findFirst({
		where: {
			id: userId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			user_types: {
				select: {
					name: true,
				},
			},
		},
	});
}

export const userRepository = {
	getStatusIdFromName,
	createStudentHistory,
	getIfStudentIsEnrolled,
	getStudentClasses,
	GetStudentClassInfo,
	studentExists,
	isStudent,
	isEnrolled,
	updateStudentStatus,
	getUserById,
};
