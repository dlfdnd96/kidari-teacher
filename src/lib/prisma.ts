import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log: ['query', 'info', 'warn', 'error'],
	})

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma
}

async function connectPrismaWithLog() {
	try {
		await prisma.$connect()
		console.log('✅ [Prisma] 데이터베이스 연결 성공')
	} catch (error) {
		console.error('❌ [Prisma] 데이터베이스 연결 실패:', error)
	}
}

connectPrismaWithLog()
