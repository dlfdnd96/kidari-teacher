import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === 'development'
				? ['query', 'info', 'warn', 'error']
				: ['warn', 'error'],
	})

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma
}

if (process.env.NODE_ENV === 'development') {
	try {
		;(prisma as any).$on('query', (e: any) => {
			console.log('Query: ' + e.query)
			console.log('Params: ' + e.params)
			console.log('Duration: ' + e.duration + 'ms')
		})
	} catch (error) {
		console.warn('Query logging 설정 실패:', error)
	}
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
