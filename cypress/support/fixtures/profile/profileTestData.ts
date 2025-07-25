import { Enum, ZodEnum } from '../../../../src/enums'
import { ZodType } from '../../../../src/shared/types'

export interface ProfileData {
	name: string
}

export interface UserProfileData {
	phone: string
	organization?: string
	professions: ZodType<typeof ZodEnum.Profession>[]
}

export interface SetupProfileData {
	name: string
	phone: string
	organization?: string
	professions: ZodType<typeof ZodEnum.Profession>[]
}

export class ProfileTestDataFactory {
	static createUpdatedTestProfile(): ProfileData {
		const timestamp = Date.now()
		return {
			name: `수정된 테스트 사용자 ${timestamp.toString().slice(0, -6)}`,
		}
	}

	static createTestUserProfile(): UserProfileData {
		const timestamp = Date.now()
		return {
			phone: '01012345678',
			organization: `테스트 기관 ${timestamp}`,
			professions: [Enum.Profession.LAWYER],
		}
	}

	static createUpdatedTestUserProfile(): UserProfileData {
		const timestamp = Date.now()
		return {
			phone: '01087654321',
			organization: `수정된 테스트 기관 ${timestamp}`,
			professions: [Enum.Profession.LAWYER, Enum.Profession.ACTUARY],
		}
	}

	static createTestSetupProfile(): SetupProfileData {
		const timestamp = Date.now()
		return {
			name: `설정 테스트 사용자 ${timestamp.toString().slice(0, -6)}`,
			phone: '01055555555',
			organization: `설정 테스트 기관 ${timestamp}`,
			professions: [Enum.Profession.LAWYER],
		}
	}
}
