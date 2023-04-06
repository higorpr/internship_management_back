import { reports } from "@prisma/client";
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
		},
	});
}

export const reportRepository = {createInitialReport};