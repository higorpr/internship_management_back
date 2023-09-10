import { companies, internships, report_status } from "@prisma/client";
import { prisma } from "../../config/db";

async function createInternship(
	companyId: number,
	studentId: number,
	startDate: Date,
	weeklyHours: number,
	classId: number
): Promise<internships> {
	const internship = await prisma.internships.create({
		data: {
			company_id: companyId,
			student_id: studentId,
			start_date: startDate,
			weekly_hours: weeklyHours,
			class_id: classId,
		},
	});
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

async function updateReportsForInternshipCreation(
	studentId: number,
	classId: number,
	internshipId: number,
	dueDates: Date[]
): Promise<void> {
	const reportsStatusRes: report_status =
		await prisma.report_status.findFirst({
			where: {
				name: "WAITING",
			},
		});

	const reportStatusId = Number(reportsStatusRes.id);

	const nReportsRes = await prisma.classes.findFirst({
		where: {
			id: classId,
		},
		select: {
			class_type: {
				select: {
					number_reports: true,
				},
			},
		},
	});

	const nReports = Number(nReportsRes.class_type.number_reports);

	for (let i = 1; i <= nReports; i++) {
		await prisma.reports.updateMany({
			where: {
				student_id: studentId,
				class_id: classId,
				report_number: i,
			},
			data: {
				internship_id: internshipId,
				status_id: reportStatusId,
				due_date: dueDates[i - 1],
			},
		});
	}
}

async function getInternshipById(internshipId: number): Promise<internships> {
	return await prisma.internships.findFirst({
		where: {
			id: internshipId,
		},
	});
}

async function deleteInternship(internshipId: number): Promise<internships> {
	return prisma.internships.delete({
		where: {
			id: internshipId,
		},
	});
}

export const internshipRepository = {
	createInternship,
	createCompany,
	getCompanyByName,
	updateReportsForInternshipCreation,
	getInternshipById,
	deleteInternship,
};
