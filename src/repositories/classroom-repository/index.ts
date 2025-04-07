import { prisma } from "../../config/db";
import {
	classes,
	class_type,
	users,
} from "@prisma/client";

type UserType = { user_types: { name: string } };

async function getAllClasses(ownerId: number): Promise<classes[]> {
	return await prisma.classes.findMany({ where: { owner_id: ownerId } });
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
	classTypeId: number,
	ownerId: number
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
			owner_id: ownerId,
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

export type completeClassInfo = {
	name: string;
	is_active: boolean;
	class_code: string;
	user_class: {
		users: {
			id: number;
			name: string;
			reports: {
				report_number: number;
				report_status: {
					name: string;
				};
			}[];
		};
	}[];
	class_type: {
		name: string;
		number_reports: number;
	};
};

async function getCompleteClassInfo(
	classId: number
): Promise<completeClassInfo> {
	return await prisma.classes.findUnique({
		where: {
			id: classId,
		},
		select: {
			name: true,
			is_active: true,
			class_code: true,
			class_type: {
				select: {
					name: true,
					number_reports: true,
				},
			},
			user_class: {
				where: {
					class_id: classId,
				},
				select: {
					users: {
						select: {
							id: true,
							name: true,
							reports: {
								where: {
									class_id: classId,
								},
								select: {
									report_number: true,
									report_status: {
										select: {
											name: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});
}

async function getOwnerInfo(classId: number): Promise<users> {
	const ownerIdObj = await prisma.classes.findFirst({
		where: { id: classId },
		select: {
			owner_id: true,
		},
	});
	const ownerId = ownerIdObj.owner_id;
	const ownerInfo = await prisma.users.findFirst({
		where: { id: ownerId },
	});
	return ownerInfo;
}

async function getClassById(classId: number): Promise<classes> {
	return await prisma.classes.findFirst({
		where: {
			id: classId,
		},
	});
}

type classReportType = {
	user_class: {
		users: {
			name: string;
			reports: {
				report_number: number;
				report_status: {
					name: string;
				};
				student_id: number;
				class_id: number;
				is_delivered: boolean;
				status_id: number;
				delivery_date: Date;
				last_version_sent: number;
				due_date: Date;
			}[];
			internships: {
				id: number;
				student_id: number;
				start_date: Date;
				weekly_hours: number;
				class_id: number;
				companies: {
					name: string;
				};
			}[];
		};
	}[];
};

async function getClassReportInfo(classId: number): Promise<classReportType> {
	return await prisma.classes.findUnique({
		where: {
			id: classId,
		},
		select: {
			user_class: {
				where: {
					class_id: classId,
				},
				select: {
					users: {
						select: {
							name: true,
							reports: {
								orderBy: {
									report_number: "asc",
								},
								where: {
									class_id: classId,
								},
								select: {
									student_id: true,
									class_id: true,
									is_delivered: true,
									report_number: true,
									status_id: true,
									delivery_date: true,
									due_date: true,
									last_version_sent: true,
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
									student_id: true,
									start_date: true,
									weekly_hours: true,
									class_id: true,
									companies: {
										select: {
											name: true,
										},
									},
								},
							},
						},
					},
				},
			},
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
	getCompleteClassInfo,
	getOwnerInfo,
	getClassById,
	getClassReportInfo,
};
