import { companies, internships } from "@prisma/client";
import { internshipRepository } from "../../repositories/internship-repository";
import dayjs from "dayjs";
import { EarlyInternshipError, InternshipNotFound } from "./errors";
import { classroomService } from "../classroom-service";
import("dayjs/locale/pt-br");

async function getCompanyIdByName(
	companyName: string
): Promise<number | boolean> {
	const companyInfo = await internshipRepository.getCompanyByName(
		companyName
	);

	if (companyInfo) {
		return companyInfo.id;
	}

	return false;
}

async function postNewCompany(companyName: string): Promise<companies> {
	const createdCompany = await internshipRepository.createCompany(
		companyName
	);

	return createdCompany;
}

async function postInternship(
	companyName: string,
	studentId: number,
	startDate: Date,
	weeklyHours: number,
	classId: number
): Promise<internships> {
	let companyId: number;
	const companyIdCheck = await getCompanyIdByName(companyName);

	if (!companyIdCheck) {
		const createdCompany = await postNewCompany(companyName);
		companyId = createdCompany.id;
	} else {
		companyId = Number(companyIdCheck);
	}

	const internship = await internshipRepository.createInternship(
		companyId,
		studentId,
		startDate,
		weeklyHours,
		classId
	);

	return internship;
}

function generateDueDates(
	internshipStartDate: Date,
	weeklyHours: number
): Date[] {
	dayjs.locale("pt-br");
	const dueDates: Date[] = [];
	const startDate = dayjs(internshipStartDate);

	//definição do número de horas entre relatórios e horas diárias de estágio
	const totalHours = 160;
	const nReports = 3;
	const hoursBetweenReports = Math.ceil(totalHours / nReports);
	const nWeekdays = 5;
	const dailyHours = weeklyHours / nWeekdays;

	// pega o dia de início de estágio e inicia-se a contagem de horas
	// a partir dessa semana, conta quantos dias trabalho vão corresponder a 160h/3 (~54h)
	// e adiciona esses dias a data inicial
	// repete a operação para o número de relatórios
	let dueDate = startDate;
	for (let i = 0; i < nReports; i++) {
		let countdown = hoursBetweenReports;
		let days = 0;
		while (countdown - dailyHours >= -dailyHours) {
			const weekday = dueDate.add(days, "day").get("day");
			if (!(weekday === 6 || weekday === 0)) {
				countdown -= dailyHours;
			}
			days++;
		}
		dueDate = dueDate.add(days, "day");
		while (dueDate.get("day") === 0 || dueDate.get("day") === 6) {
			dueDate = dueDate.add(1, "day");
		}
		dueDates.push(dueDate.toDate());
	}

	// retorna a lista
	return dueDates;
}

async function updateReportForInternshipCreation(
	studentId: number,
	classId: number,
	internshipId: number,
	startDate: Date,
	weeklyHours: number
) {
	const dueDates: Date[] = generateDueDates(startDate, weeklyHours);

	await internshipRepository.updateReportsForInternshipCreation(
		studentId,
		Number(classId),
		internshipId,
		dueDates
	);
}

async function getInternshipById(internshipId: number): Promise<internships> {
	const IntIdObj = await internshipRepository.getInternshipById(internshipId);
	if (!IntIdObj) {
		throw InternshipNotFound();
	}
	return IntIdObj;
}

async function deleteInternship(internshipId: number) {
	const deletedInternship = await internshipRepository.deleteInternship(
		internshipId
	);
	return deletedInternship;
}

async function checkInternshipStartDate(
	classId: number,
	internshipStartDate: Date
): Promise<void> {
	const classObj = await classroomService.getClassById(Number(classId));
	const classStartDate = classObj.start_date;

	if (classStartDate.getTime() > internshipStartDate.getTime()) {
		const day = classStartDate.getDate();
		const month = classStartDate.getMonth() + 1;
		const year = classStartDate.getFullYear();		
		const onlyDate = `${day}/${month}/${year}`;

		throw EarlyInternshipError(onlyDate);
	}
}

export const internshipService = {
	postInternship,
	updateReportForInternshipCreation,
	generateDueDates,
	getInternshipById,
	deleteInternship,
	checkInternshipStartDate,
};
