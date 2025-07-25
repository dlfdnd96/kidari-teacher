import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as z from 'zod/v4'
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

			case 'applications':
				const applicationResults = await cleanupApplications(testRunId)
				Object.assign(deletedItems, applicationResults)
				deletedCount = Object.values(applicationResults).reduce(
					(sum, count) => sum + count,
					0,
				)
				break

			case 'volunteer-activities':
				const volunteerResults = await cleanupVolunteerActivities(testRunId)
				Object.assign(deletedItems, volunteerResults)
				deletedCount = Object.values(volunteerResults).reduce(
					(sum, count) => sum + count,
					0,
				)
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
async function cleanupNotices(_testRunId: string): Promise<number> {
	return await prisma.$transaction(async (tx) => {
		const { count } = await tx.notice.deleteMany()
		return count
	})
}

// 봉사활동 신청 정리
async function cleanupApplications(
	_testRunId: string,
): Promise<Record<string, number>> {
	return await prisma.$transaction(async (tx) => {
		const { count } = await tx.application.deleteMany()
		return { volunteerApplications: count }
	})
}

// 봉사활동 정리
async function cleanupVolunteerActivities(
	_testRunId: string,
): Promise<Record<string, number>> {
	return await prisma.$transaction(async (tx) => {
		const { count } = await tx.volunteerActivity.deleteMany()
		return { volunteerActivities: count }
	})
}

// 테스트 유저 프로필 정리
async function cleanupTestUserProfiles(
	_testRunId: string,
): Promise<Record<string, number>> {
	return await prisma.$transaction(async (tx) => {
		const userProfilesResult = await tx.userProfile.deleteMany()
		const userProfessionsResult = await tx.userProfession.deleteMany()
		return {
			userProfiles: userProfilesResult.count,
			userProfessions: userProfessionsResult.count,
		}
	})
}

// 테스트 사용자 정리
async function cleanupTestUsers(_testRunId: string): Promise<number> {
	return await prisma.$transaction(async (tx) => {
		await tx.userProfile.deleteMany()
		await tx.userProfession.deleteMany()
		const { count } = await tx.user.deleteMany()
		return count
	})
}

// 모든 테스트 데이터 정리
async function cleanupAllTestData(
	_testRunId: string,
): Promise<Record<string, number>> {
	return await prisma.$transaction(async (tx) => {
		const noticesResult = await tx.notice.deleteMany()
		const applicationsResult = await tx.application.deleteMany()
		const volunteerActivitiesResult = await tx.volunteerActivity.deleteMany()

		await tx.userProfile.deleteMany()
		await tx.userProfession.deleteMany()
		const usersResult = await tx.user.deleteMany()

		return {
			notices: noticesResult.count,
			applications: applicationsResult.count,
			volunteerActivities: volunteerActivitiesResult.count,
			users: usersResult.count,
		}
	})
}

// 모든 데이터 정리 (주의: 프로덕션에서는 사용하지 말 것)
async function cleanupAllData(): Promise<Record<string, number>> {
	return await prisma.$transaction(async (tx) => {
		// 순서 중요: 외래키 관계 고려하여 삭제
		const sessionsResult = await tx.session.deleteMany()
		const noticesResult = await tx.notice.deleteMany()
		const usersResult = await tx.user.deleteMany()
		return {
			sessions: sessionsResult.count,
			notices: noticesResult.count,
			users: usersResult.count,
		}
	})
}
