import type {
	MenuItem,
	ProfessionTag,
	SchoolLogo,
	TestimonialItem,
} from '@/types/landing'

export const ACTIVITY_STATUS = {
	COMPLETED: '완료',
	IN_PROGRESS: '진행중',
	PENDING: '대기중',
	CANCELLED: '취소',
} as const

export const ACTIVITY_TYPE = {
	HIGH_SCHOOL: '고등학교',
	MIDDLE_SCHOOL: '중학교',
	UNIVERSITY: '대학교',
	VOLUNTEER: '봉사활동',
} as const

export const MENU_ITEMS: MenuItem[] = [
	{ id: 'members', label: '구성원', href: '#members' },
	{ id: 'purpose', label: '활동 목적', href: '#purpose' },
	{ id: 'achievements', label: '활동 내역', href: '#achievements' },
	{ id: 'collaboration', label: '협의 방법', href: '#collaboration' },
	{ id: 'contact', label: '연락처', href: '#contact' },
]

export const PROFESSION_TAGS: ProfessionTag[] = [
	{ id: '1', label: '한의사', variant: 'primary', size: 'xl' },
	{ id: '2', label: '치과의사', variant: 'primary', size: 'xl' },
	{ id: '3', label: '의사', variant: 'primary', size: 'xl' },
	{ id: '4', label: '회계사', variant: 'primary', size: 'xl' },
	{ id: '5', label: '변호사', variant: 'primary', size: 'xl' },
	{ id: '6', label: '세무사', variant: 'primary', size: 'xl' },
	{ id: '7', label: '노무사', variant: 'primary', size: 'xl' },
	{ id: '8', label: '법무사', variant: 'primary', size: 'xl' },
	{ id: '9', label: '행정사', variant: 'primary', size: 'xl' },
	{ id: '10', label: '감정평가사', variant: 'primary', size: 'xl' },
	{ id: '11', label: 'IT 개발자', variant: 'primary', size: 'xl' },
	{ id: '12', label: 'IT 기획자', variant: 'primary', size: 'xl' },
	{ id: '13', label: '의학연구자', variant: 'primary', size: 'xl' },
	{ id: '14', label: '보험계리사', variant: 'primary', size: 'xl' },
	{ id: '15', label: '약사', variant: 'primary', size: 'xl' },
	{ id: '16', label: '변리사', variant: 'primary', size: 'xl' },
	{ id: '17', label: '생명공학', variant: 'primary', size: 'xl' },
	{ id: '18', label: '기계공학', variant: 'primary', size: 'xl' },
	{ id: '19', label: '산업공학', variant: 'primary', size: 'xl' },
]

export const SCHOOL_LOGOS: SchoolLogo[] = [
	{
		src: '/images/school-logo/whimoon-dark.svg',
		alt: '휘문고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/kwangsung-dark.svg',
		alt: '광성고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/paichai-dark.svg',
		alt: '배제고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/yangchung-dark.svg',
		alt: '양정고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/jaehyun-dark.svg',
		alt: '재현고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/yumkwang-dark.svg',
		alt: '염광고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/kwanak-dark.svg',
		alt: '관악고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/yale-girls-dark.svg',
		alt: '예일여자고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/hanseo-dark.svg',
		alt: '한서고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/soongmoon-dark.svg',
		alt: '숭문고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/munhyeon-dark.svg',
		alt: '문현고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/solsaem-dark.svg',
		alt: '솔샘고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/pungsaeng-dark.svg',
		alt: '풍생고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/daewon-girls-dark.svg',
		alt: '대원여자고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/posung-dark.svg',
		alt: '보성고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/cheongwon-dark.svg',
		alt: '청원고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/inje-dark.svg',
		alt: '인재고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/daewon-dark.svg',
		alt: '대원고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/guhyun-dark.svg',
		alt: '구현고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/jayang-dark.svg',
		alt: '자양고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/zion-dark.svg',
		alt: '시온고등학교',
		width: 180,
		height: 65,
	},
	{
		src: '/images/school-logo/baemyeong-dark.svg',
		alt: '배명고등학교',
		width: 180,
		height: 65,
	},
]

export const SCHOOL_FEEDBACKS: TestimonialItem[] = [
	{
		id: '1',
		quote:
			'아이들이 적극적으로 질문하는 경우가 드문데, 직업인과의 대화때는 아이들이 질문도 많이하고, 대화 기록지보면 내용도 풍부하게 작성하는 편이라 만족도가 높습니다 :)',
	},
	{
		id: '2',
		quote:
			'특히 나이 차이가 많이 나지 않으신 분들이 오시다보니 학생들이 궁금해하는 진학방법, 사회초년생으로서의 직업 만족도 등을 편히 질문할 수 있어서 좋은 것 같습니다.',
	},
	{
		id: '3',
		quote:
			'또 같은 말이라도 선생님들이 이야기하면 잘 듣지 않는데, 아무래도 희망하는 직업을 가지신 분들이 이야기해 주시니 학생들이 더 느끼는게 많은 것 같아요^^',
	},
]

export const COLLABORATION_STEPS = [
	{
		id: 1,
		title: '일정 협의',
		description:
			'진로 담당 선생님과 키다리 선생님이 함께 봉사 일정을 협의하여 결정합니다.',
	},
	{
		id: 2,
		title: '봉사자 신청 접수',
		description:
			'결정된 일정에 따라 키다리 선생님에서 봉사 신청자를 취합합니다.',
	},
	{
		id: 3,
		title: '봉사자 정보 전달',
		description:
			'봉사 신청이 마무리되면 봉사자 정보와 전문분야를 학교 측에 전달합니다.',
	},
	{
		id: 4,
		title: '수요 조사 결과 안내',
		description:
			'학교에서 학생들의 진로 교육 희망 분야를 취합한 최종 수요와 봉사 당일 세부사항을 안내합니다.',
	},
]

export const SECTION_IDS = {
	MEMBERS: 'members',
	PURPOSE: 'purpose',
	ACHIEVEMENTS: 'achievements',
	COLLABORATION: 'collaboration',
	CONTACT: 'contact',
} as const

export const BRAND_INFO = {
	NAME: '키다리 선생님',
	SUBTITLE: '전문직 멘토링 봉사동아리',
	DESCRIPTION: '학생들의 진로 선택에 도움이 되는 전문직 멘토링',
	LOGO_PATH: '/images/logo.png',
	LOGO_ALT: '키다리 선생님 로고',
} as const
