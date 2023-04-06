import { reportRepository } from "../../repositories/report-repository";

async function createInitialReports(
	userId: number,
	classId: number,
	nReports: number
) {
	const initialReports = [];
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

export const reportService = { createInitialReports };
