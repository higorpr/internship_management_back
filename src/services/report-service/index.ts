import { reports } from "@prisma/client";
import { reportRepository } from "../../repositories/report-repository";
import fs from "fs";
import path from "path";
import sgMail from "@sendgrid/mail";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { MailDataRequired } from "@sendgrid/mail";

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
	// const msg = {
	// 	to, // Change to your recipient
	// 	from: process.env.FROM_EMAIL,
	// 	subject: subject,
	// 	text: message,
	// 	html: "<strong>and easy to do anywhere, even with Node.js</strong>",
	// };

	const mail = await sgMail.send(email);

	return mail;
}

function deleteFile(file: Express.Multer.File) {
	fs.unlinkSync(path.join(__dirname, "../../../", file.path));
}

export const reportService = {
	createInitialReports,
	sendReportByEmail,
	deleteFile,
};
