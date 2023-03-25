import { classes } from "@prisma/client";
import { classroomRepository } from "../../repositories/classroom-repository";
import { mustBeTeacherError } from "./errors";

async function getAllClasses(): Promise<classes[]> {
	const allClasses = await classroomRepository.getAllClasses();
	return allClasses;
}

async function teacherCheck(userId: number): Promise<void> {
	const userTypePayload = await classroomRepository.getUserType(userId);
	const userType = userTypePayload.user_types.name;

	if (userType !== "PROFESSOR") {
		throw mustBeTeacherError();
	}
}

export const classroomService = { getAllClasses, teacherCheck };
