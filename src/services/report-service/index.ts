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
	// console.log("DIRNAME", __dirname);
	const caminho = path.join(__dirname, "../../../", file.path);
	console.log("CAMINHO", caminho);

	const attachment: AttachmentData = {
		filename: file.originalname,
		content: fs.readFileSync(caminho).toString("base64"),
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

function deleteFile(file: Express.Multer.File) {
	fs.unlinkSync(path.join(__dirname, "../../../", file.path));
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



export const reportService = {
	createInitialReports,
	sendReportByEmail,
	deleteFile,
	updateReportStatus,
	checkIfTeacher,
};
