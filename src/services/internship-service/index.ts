import { companies, internships } from "@prisma/client";
import { internshipRepository } from "../../repositories/internship-repository";

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
	weeklyHours: number
): Promise<internships> {
	let companyId: number;
	const companyIdCheck = await getCompanyIdByName(companyName);
	console.log(companyIdCheck);

	if (!companyIdCheck) {
		const createdCompany = await postNewCompany(companyName);
		companyId = createdCompany.id;
		console.log("Inexistent Company", companyId);
	} else {
		companyId = Number(companyIdCheck);
		console.log("Existing Company", companyId);
	}

	const internship = await internshipRepository.createInternship(
		companyId,
		studentId,
		startDate,
		weeklyHours
	);

	console.log(internship);

	return internship;
}

export const internshipService = { postInternship };
