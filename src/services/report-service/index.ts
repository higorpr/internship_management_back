import { reports } from "@prisma/client";
import { reportRepository } from "../../repositories/report-repository";
import fs from "fs";
import path from "path";
import sgMail from "@sendgrid/mail";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { MailDataRequired } from "@sendgrid/mail";
import { userService } from "../user-service";
import { mustBeTeacherError } from "./errors";

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
	file: Express.Multer.File
) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	// const dirPath = path.join(__dirname, "../../../", file.path);
	// const dirPath = path.join(file.path);

	const attachment: AttachmentData = {
		filename: file.originalname,
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

export const reportService = {
	createInitialReports,
	sendReportByEmail,
	deleteFile,
	updateReportStatus,
	checkIfTeacher,
	updateReportsIfExpired,
	getReportInfo,
	updateReportDeliveryInformation,
};
