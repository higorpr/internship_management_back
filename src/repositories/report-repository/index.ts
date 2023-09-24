import { Prisma, reports } from "@prisma/client";
import { prisma } from "../../config/db";

async function createInitialReport(
	userId: number,
	classId: number,
	reportOrder: number
): Promise<reports> {
	const TBDStatus = await prisma.report_status.findFirst({
		where: {
			name: "TBD",
		},
	});
	const TBDStatusId = TBDStatus.id;
	return await prisma.reports.create({
		data: {
			student_id: userId,
			class_id: classId,
			is_delivered: false,
			report_number: reportOrder,
			status_id: TBDStatusId,
			last_version_sent: 0,
		},
	});
}

async function revertReportsToInitalState(reportIds: number[]) {
	const TBDStatus = await prisma.report_status.findFirst({
		where: {
			name: "TBD",
		},
	});
	const TBDStatusId = TBDStatus.id;
	return await prisma.reports.updateMany({
		where: {
			id: { in: reportIds },
		},
		data: {
			is_delivered: false,
			internship_id: null,
			status_id: TBDStatusId,
			delivery_date: null,
			due_date: null,
			last_version_sent: 0,
		},
	});
}

async function updateReportStatus(
	reportId: number,
	reportStatus: string
): Promise<reports> {
	const reportStatusId = await prisma.report_status.findFirst({
		where: {
			name: reportStatus,
		},
	});

	return await prisma.reports.update({
		where: {
			id: reportId,
		},
		data: {
			status_id: reportStatusId.id,
		},
	});
}

async function getClassReports(classId: number): Promise<reports[]> {
	return await prisma.reports.findMany({
		where: {
			class_id: classId,
		},
	});
}

async function getReportInfo(reportId: number) {
	return await prisma.reports.findFirst({
		where: {
			id: reportId,
		},
		include: {
			users: {
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
	});
}

async function updateReportDeliveryInformation(
	reportId: number
): Promise<reports> {
	const deliveredStatusObj = await prisma.report_status.findFirst({
		where: {
			name: "DELIVERED",
		},
	});
	const versionObj = await prisma.reports.findFirst({
		where: {
			id: reportId,
		},
		select: {
			last_version_sent: true,
		},
	});

	const version = versionObj.last_version_sent;
	const deliveredStatusId = deliveredStatusObj.id;

	return await prisma.reports.update({
		where: {
			id: reportId,
		},
		data: {
			is_delivered: true,
			status_id: deliveredStatusId,
			delivery_date: new Date(),
			last_version_sent: version + 1,
		},
	});
}

async function getReportStatusId(
	reportStatus: string
): Promise<{ id: number }> {
	return await prisma.report_status.findFirst({
		where: {
			name: reportStatus,
		},
		select: {
			id: true,
		},
	});
}

async function getReportByInternshipId(
	internshipId: number
): Promise<reports[]> {
	return await prisma.reports.findMany({
		where: {
			internship_id: internshipId,
		},
	});
}

async function getReportEmailInfo(reportId: number): Promise<{
	studentName: string;
	studentEmail: string;
	reportNumber: number;
	reportState: string;
	teacherEmail: string;
}> {
	const reportInfo = await prisma.reports.findFirst({
		where: { id: reportId },
		select: {
			student_id: true,
			report_number: true,
			class_id: true,
			report_status: {
				select: {
					name: true,
				},
			},
		},
	});
	const studentInfo = await prisma.users.findUnique({
		where: {
			id: reportInfo.student_id,
		},
		select: {
			name: true,
			email: true,
		},
	});
	const classInfo = await prisma.classes.findUnique({
		where: {
			id: reportInfo.class_id,
		},
		select: {
			owner_id: true,
		},
	});
	const teacherInfo = await prisma.users.findUnique({
		where: { id: classInfo.owner_id },
		select: {
			email: true,
		},
	});

	return {
		studentName: studentInfo.name,
		studentEmail: studentInfo.email,
		reportNumber: reportInfo.report_number,
		reportState: reportInfo.report_status.name,
		teacherEmail: teacherInfo.email,
	};
}

export const reportRepository = {
	createInitialReport,
	updateReportStatus,
	getClassReports,
	getReportInfo,
	updateReportDeliveryInformation,
	getReportStatusId,
	getReportByInternshipId,
	revertReportsToInitalState,
	getReportEmailInfo,
};
