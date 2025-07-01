import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod/v4'
import { ZodEnum } from '@/enums'

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json()
		if (body.NODE_ENV !== 'test' || body.CYPRESS !== 'true') {
			return NextResponse.json({ message: 'Not found' }, { status: 404 })
		}

		const dataType = ZodEnum.TestDataType.parse(body.params.dataType)
		const testRunId = body.testRun || 'default'

		let deletedCount = 0
		const deletedItems: Record<string, number> = {}
		switch (dataType) {
			case 'notices':
				deletedCount = await cleanupNotices(testRunId)
				deletedItems.notices = deletedCount
				break

			case 'users':
				deletedCount = await cleanupTestUsers(testRunId)
				deletedItems.users = deletedCount
				break

			case 'user-profiles':
				const userProfileResults = await cleanupTestUserProfiles(testRunId)
				Object.assign(deletedItems, userProfileResults)
				deletedCount = Object.values(userProfileResults).reduce(
					(sum, count) => sum + count,
					0,
				)
				break

			case 'test-data':
				const results = await cleanupAllTestData(testRunId)
				Object.assign(deletedItems, results)
				deletedCount = Object.values(results).reduce(
					(sum, count) => sum + count,
					0,
				)
				break

			case 'all':
				const allResults = await cleanupAllData()
				Object.assign(deletedItems, allResults)
				deletedCount = Object.values(allResults).reduce(
					(sum, count) => sum + count,
					0,
				)
				break

			default:
				return NextResponse.json(
					{ message: `Unsupported data type: ${dataType}` },
					{ status: 400 },
				)
		}

		console.log(`Cypress cleanup completed: ${dataType}`, deletedItems)

		return NextResponse.json({
			success: true,
			dataType,
			testRunId,
			deletedCount,
			deletedItems,
			message: `Successfully cleaned up ${deletedCount} items`,
		})
	} catch (error) {
		if (['development', 'test'].includes(process.env.NODE_ENV)) {
			console.error('Cypress cleanup error:', error)
		}

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					message: 'Invalid data type',
					validTypes: ZodEnum.TestDataType,
				},
				{ status: 400 },
			)
		}

		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 },
		)
	}
}

// 공지사항 정리
async function cleanupNotices(testRunId: string): Promise<number> {
	const result: Record<string, number> = {}
	await prisma.$transaction(async (tx) => {
		const { count } = await tx.notice.deleteMany({
			where: {
				OR: [
					{ title: { contains: '테스트' } },
					{ title: { contains: 'test' } },
					{ title: { contains: 'Test' } },
					{ content: { contains: testRunId } },
				],
			},
		})
		result.count = count
	})

	return result.count
}

// 테스트 사용자 정리
async function cleanupTestUsers(_testRunId: string): Promise<number> {
	const result: Record<string, number> = {}
	await prisma.$transaction(async (tx) => {
		await tx.userProfile.deleteMany({
			where: {
				user: {
					OR: [
						{ email: { contains: 'test' } },
						{ email: { contains: 'cypress' } },
						{ name: { contains: 'test' } },
					],
				},
			},
		})
		await tx.userProfession.deleteMany({
			where: {
				user: {
					OR: [
						{ email: { contains: 'test' } },
						{ email: { contains: 'cypress' } },
						{ name: { contains: 'test' } },
					],
				},
			},
		})
		const { count } = await tx.user.deleteMany({
			where: {
				OR: [
					{ email: { contains: 'test' } },
					{ email: { contains: 'cypress' } },
					{ name: { contains: 'test' } },
					{ email: { endsWith: '@test.com' } },
				],
			},
		})
		result.count = count
	})

	return result.count
}

// 테스트 유저 프로필 정리
async function cleanupTestUserProfiles(
	_testRunId: string,
): Promise<Record<string, number>> {
	const results: Record<string, number> = {}
	await prisma.$transaction(async (tx) => {
		const userProfilesResult = await tx.userProfile.deleteMany({
			where: {
				user: {
					OR: [
						{ email: { contains: 'test' } },
						{ email: { contains: 'cypress' } },
						{ name: { contains: 'test' } },
					],
				},
			},
		})
		results.userProfiles = userProfilesResult.count

		const userProfessionsResult = await tx.userProfession.deleteMany({
			where: {
				user: {
					OR: [
						{ email: { contains: 'test' } },
						{ email: { contains: 'cypress' } },
						{ name: { contains: 'test' } },
					],
				},
			},
		})
		results.userProfessions = userProfessionsResult.count
	})

	return results
}

// 모든 테스트 데이터 정리
async function cleanupAllTestData(
	testRunId: string,
): Promise<Record<string, number>> {
	const results: Record<string, number> = {}
	await prisma.$transaction(async (tx) => {
		const noticesResult = await tx.notice.deleteMany({
			where: {
				OR: [
					{ title: { contains: '테스트' } },
					{ title: { contains: 'test' } },
					{ content: { contains: testRunId } },
				],
			},
		})
		results.notices = noticesResult.count

		await tx.userProfile.deleteMany({
			where: {
				user: {
					OR: [
						{ email: { contains: 'test' } },
						{ email: { contains: 'cypress' } },
						{ name: { contains: 'test' } },
					],
				},
			},
		})
		await tx.userProfession.deleteMany({
			where: {
				user: {
					OR: [
						{ email: { contains: 'test' } },
						{ email: { contains: 'cypress' } },
						{ name: { contains: 'test' } },
					],
				},
			},
		})
		const usersResult = await tx.user.deleteMany({
			where: {
				OR: [
					{ email: { contains: 'test' } },
					{ email: { contains: 'cypress' } },
					{ email: { endsWith: '@test.com' } },
				],
			},
		})
		results.users = usersResult.count
	})

	return results
}

// 모든 데이터 정리 (주의: 프로덕션에서는 사용하지 말 것)
async function cleanupAllData(): Promise<Record<string, number>> {
	const results: Record<string, number> = {}

	await prisma.$transaction(async (tx) => {
		// 순서 중요: 외래키 관계 고려하여 삭제
		const sessionsResult = await tx.session.deleteMany()
		results.sessions = sessionsResult.count

		const noticesResult = await tx.notice.deleteMany()
		results.notices = noticesResult.count

		const usersResult = await tx.user.deleteMany()
		results.users = usersResult.count
	})

	return results
}
