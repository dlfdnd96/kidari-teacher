import { ZodType } from '@/shared/types'
import { ZodEnum } from '@/enums'

export const PROFESSION_LABELS: Record<
	ZodType<typeof ZodEnum.Profession>,
	string
> = {
	KOREAN_MEDICINE_DOCTOR: '한의사',
	DENTIST: '치과의사',
	MEDICAL_DOCTOR: '의사',
	ACCOUNTANT: '회계사',
	LAWYER: '변호사',
	TAX_ACCOUNTANT: '세무사',
	LEGAL_AFFAIRS_SPECIALIST: '법무사',
	ADMINISTRATIVE_SPECIALIST: '행정사',
	PROPERTY_APPRAISER: '감정평가사',
	IT_DEVELOPER: 'IT개발자',
	IT_ENGINEER: 'IT엔지니어',
	BIOTECHNOLOGY_PHD: '생명공학 박사',
	MEDICAL_RESEARCHER: '의학 연구원',
	ACTUARY: '보험계리사',
	CIVIL_SERVANT: '사무관',
	PHARMACIST: '약사',
	PATENT_ATTORNEY: '변리사',
	MECHANICAL_ENGINEERING_PHD: '기계공학 박사',
	INDUSTRIAL_ENGINEERING_PHD: '산업공학 박사',
}
