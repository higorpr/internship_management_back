import { companies, internships } from "@prisma/client";
import { prisma } from "../../config/db";

async function createInternship(
	companyId: number,
	studentId: number,
	startDate: Date,
	weeklyHours: number
): Promise<internships> {
	console.log("createInternship", {
		companyId,
		studentId,
		startDate,
		weeklyHours,
	});
	const internship = await prisma.internships.create({
		data: {
			company_id: companyId,
			student_id: studentId,
			start_date: startDate,
			weekly_hours: weeklyHours,
		},
	});
	console.log(internship);
	return internship;
}

async function createCompany(companyName: string): Promise<companies> {
	return await prisma.companies.create({
		data: {
			name: companyName,
		},
	});
}

async function getCompanyByName(companyName: string) {
	return await prisma.companies.findFirst({
		where: {
			name: {
				mode: "insensitive",
				equals: companyName,
			},
		},
	});
}

export const internshipRepository = {
	createInternship,
	createCompany,
	getCompanyByName,
};
