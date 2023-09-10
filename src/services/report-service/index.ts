import { reports } from "@prisma/client";
import { reportRepository } from "../../repositories/report-repository";
import fs from "fs";
import path from "path";
import sgMail from "@sendgrid/mail";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { MailDataRequired } from "@sendgrid/mail";
import { userService } from "../user-service";
import { mustBeTeacherError, notPdfFile } from "./errors";

async function createInitialReports(
	userId: number,
	classId: number,
	nReports: number
): Promise<reports[]> {
	const initialReports: reports[] = [];

	for (let reportNumber = 1; reportNumber <= nReports; reportNumber++) {
		const report = await reportRepository.createInitialReport(
			userId,
			classId,
			reportNumber
		);

		initialReports.push(report);
	}

	return initialReports;
}

async function sendReportByEmail(
	to: string,
	subject: string,
	message: string,
	file: Express.Multer.File,
	studentName: string,
	reportNumber: number,
	reportVersion: number
) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const attachment: AttachmentData = {
		filename:
			`Relatório ${reportNumber}_${studentName}_V${reportVersion}`.toUpperCase(),
		content: file.buffer.toString("base64"),
		type: file.mimetype,
		disposition: "attachment",
	};

	const email: MailDataRequired = {
		to,
		from: process.env.FROM_EMAIL,
		subject,
		text: message,
		attachments: [attachment],
	};

	const mail = await sgMail.send(email);

	return mail;
}

function deleteFile(file: Express.Multer.File): void {
	const dirPath = path.join(file.path);
	fs.unlinkSync(dirPath);
}

async function updateReportStatus(
	reportId: number,
	reportStatus: string
): Promise<reports> {
	return await reportRepository.updateReportStatus(reportId, reportStatus);
}

async function checkIfTeacher(userId: number) {
	const isStudent = await userService.isStudent(userId);
	if (isStudent) {
		throw mustBeTeacherError();
	}
}

async function updateReportsIfExpired(classId: number): Promise<reports[]> {
	const reports = await reportRepository.getClassReports(classId);
	const today = new Date();
	const updatedReports: reports[] = [];
	const waitingStatus = await reportRepository.getReportStatusId("WAITING");
	reports.forEach(async (report) => {
		if (report.status_id === waitingStatus.id) {
			const dueDate = report.due_date;
			if (today.getTime() > dueDate.getTime()) {
				const updatedReport = await reportRepository.updateReportStatus(
					report.id,
					"LATE"
				);
				updatedReports.push(updatedReport);
			}
		}
	});

	return updatedReports;
}

async function getReportInfo(reportId: number) {
	return await reportRepository.getReportInfo(reportId);
}

async function updateReportDeliveryInformation(
	reportId: number
): Promise<reports> {
	return await reportRepository.updateReportDeliveryInformation(reportId);
}

function checkReportFileType(reportFile: Express.Multer.File): void {
	if (reportFile.mimetype !== "application/pdf") {
		throw notPdfFile();
	}
}

async function revertReportsToInitalState(internshipId: number) {
	const reportsObj = await reportRepository.getReportByInternshipId(
		internshipId
	);

	const reportIds: number[] = [];
	for (let i = 0; i < reportsObj.length; i++) {
		reportIds.push(reportsObj[i].id);
	}

	const updatedReports = await reportRepository.revertReportsToInitalState(
		reportIds
	);
	return updatedReports;
}

export const reportService = {
	createInitialReports,
	sendReportByEmail,
	deleteFile,
	updateReportStatus,
	checkIfTeacher,
	updateReportsIfExpired,
	getReportInfo,
	updateReportDeliveryInformation,
	checkReportFileType,
	revertReportsToInitalState,
};
