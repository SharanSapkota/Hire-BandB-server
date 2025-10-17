import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
(async () => {
	try {
		await prisma.$connect();
		console.log('Database connected successfully');
	} catch (err) {
		console.error('Database connection error', err);
	}
})();

export default prisma;
