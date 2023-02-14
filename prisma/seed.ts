import { prisma } from "../src/config/db";

async function main() {
	const reportStatuses = [
		"WAITING",
		"DELIVERED",
		"LATE",
		"ACCEPTED",
		"REFUSED",
	];
	const studentStatuses = ["ENROLLED", "APPROVED", "REPROVED"];

	reportStatuses.forEach(async (reportStatus) => {
		let report_event = await prisma.report_status.findFirst({
			where: {
				name: reportStatus,
			},
		});
		if (!report_event) {
			report_event = await prisma.report_status.create({
				data: {
					name: reportStatus,
				},
			});
		}
		console.log(report_event);
	});

	studentStatuses.forEach(async (studentStatus) => {
		let student_event = await prisma.student_status.findFirst({
			where: {
				name: studentStatus,
			},
		});
		if (!student_event) {
			student_event = await prisma.student_status.create({
				data: {
					name: studentStatus,
				},
			});

			console.log(student_event);
		}
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
