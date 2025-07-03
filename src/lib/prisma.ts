import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = global as unknown as {
	prisma: PrismaClient
	testPrisma: PrismaClient
}

export const isTestEnvironment = () => {
	return (
		process.env.NODE_ENV === 'test' ||
		process.env.CYPRESS === 'true' ||
		process.env.POSTGRES_DATABASE_URL?.includes('test')
	)
}

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === 'development'
				? ['query', 'info', 'warn', 'error']
				: ['warn', 'error'],
	})

export const testPrisma =
	globalForPrisma.testPrisma ||
	new PrismaClient({
		datasources: {
			db: {
				url: process.env.POSTGRES_DATABASE_URL,
			},
		},
		log: isTestEnvironment() ? ['error'] : ['query', 'error', 'warn'],
	})

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma
	globalForPrisma.testPrisma = testPrisma
}

if (process.env.NODE_ENV === 'development' && !isTestEnvironment()) {
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
		const client = isTestEnvironment() ? testPrisma : prisma
		await client.$connect()

		const dbName = isTestEnvironment() ? 'TEST' : 'DEV'
		console.log(`✅ [Prisma ${dbName}] 데이터베이스 연결 성공`)
	} catch (error) {
		console.error('❌ [Prisma] 데이터베이스 연결 실패:', error)
	}
}

connectPrismaWithLog()
