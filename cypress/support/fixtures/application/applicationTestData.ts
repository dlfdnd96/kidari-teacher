import { Enum, ZodEnum } from '../../../../src/enums'
import { ZodType } from '../../../../src/shared/types'

export interface ApplicationData {
	profession: ZodType<typeof ZodEnum.Profession>
	emergencyContact: string
	volunteerActivityId: string
	volunteerActivityTitle: string
}

export class ApplicationTestDataFactory {
	static createTestApplication(): ApplicationData {
		const timestamp = Date.now()
		return {
			profession: Enum.Profession.ACCOUNTANT,
			emergencyContact: '01012345678',
			volunteerActivityId: '',
			volunteerActivityTitle: `테스트 봉사활동 ${timestamp}`,
		}
	}
}
