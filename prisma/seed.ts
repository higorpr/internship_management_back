import { prisma } from "../src/config/db";

async function main() {
	const reportStatuses = [
		"WAITING",
		"DELIVERED",
		"LATE",
		"ACCEPTED",
		"REFUSED",
		"TBD",
	];
	const studentStatuses = ["ENROLLED", "APPROVED", "REPROVED"];

	const userTypes = ["PROFESSOR", "STUDENT"];

	const classesTypes = ["MANDATORY_INTERNSHIP", "REC"];

	// const companyNames = ["Higor LTDA.", "Faria S.A."];

	reportStatuses.forEach(async (reportStatus) => {
		const report_event = await prisma.report_status.findFirst({
			where: {
				name: reportStatus,
			},
		});
		if (!report_event) {
			const report_event_new = await prisma.report_status.create({
				data: {
					name: reportStatus,
				},
			});
			console.log(report_event_new);
		}
	});

	studentStatuses.forEach(async (studentStatus) => {
		const student_event = await prisma.student_status.findFirst({
			where: {
				name: studentStatus,
			},
		});
		if (!student_event) {
			const student_event_new = await prisma.student_status.create({
				data: {
					name: studentStatus,
				},
			});
			console.log(student_event_new);
		}
	});

	userTypes.forEach(async (userType) => {
		const type_user = await prisma.user_types.findFirst({
			where: {
				name: userType,
			},
		});

		if (!type_user) {
			const type = await prisma.user_types.create({
				data: {
					name: userType,
				},
			});
			console.log(type);
		}
	});

	classesTypes.forEach(async (classType) => {
		const class_type = await prisma.class_type.findFirst({
			where: {
				name: classType,
			},
		});

		const nReports = 3;

		if (!class_type) {
			const type = await prisma.class_type.create({
				data: {
					name: classType,
					number_reports: nReports,
				},
			});
			console.log(type);
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
