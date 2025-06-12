import type {
	StatCardProps,
	ProfessionGroupProps,
	FeedbackProps,
	ActivityRecordProps,
	TimeSlotProps,
	ImpactStatProps,
	ContactMethodProps,
	ProcessStepProps,
	PhotoGalleryItemProps,
} from '@/types/homepage'

export const HERO_STATS: StatCardProps[] = [
	{
		icon: 'School',
		value: '30+',
		label: '참여 학교 수',
		gradient: 'from-blue-500 to-purple-600',
		borderColor: 'border-blue-100 dark:border-gray-700',
	},
	{
		icon: 'Users',
		value: '100+',
		label: '전문직 봉사자 수',
		gradient: 'from-purple-500 to-indigo-600',
		borderColor: 'border-purple-100 dark:border-gray-700',
	},
	{
		icon: 'BarChart3',
		value: '80+',
		label: '누적 활동 횟수',
		gradient: 'from-indigo-500 to-blue-600',
		borderColor: 'border-indigo-100 dark:border-gray-700',
	},
]

export const PROFESSION_GROUPS: ProfessionGroupProps[] = [
	{
		icon: 'Scale',
		title: '법률/의료',
		description: '변호사, 의사, 치과의사, 한의사, 약사',
		gradient: 'from-red-400 to-pink-500',
	},
	{
		icon: 'DollarSign',
		title: '금융/회계',
		description: '회계사, 세무사, 보험계리사, CFA',
		gradient: 'from-green-400 to-emerald-500',
	},
	{
		icon: 'Settings',
		title: '기술/공학',
		description: 'IT전문가, 기계공학 박사, 생명공학 박사',
		gradient: 'from-blue-400 to-cyan-500',
	},
	{
		icon: 'Briefcase',
		title: '기타 전문직',
		description: '변리사, 감정평가사, 행시 출신 사무관, 노무사',
		gradient: 'from-purple-400 to-indigo-500',
	},
]

export const SCHOOL_FEEDBACKS: FeedbackProps[] = [
	{
		content:
			'아이들이 적극적으로 질문하는 경우가 드문데, 직업인과의 대화때는 아이들이 질문도 많이하고, 대화기록지보면 내용도 풍부하게 작성하는 편이라 만족도가 높습니다 😊',
		borderColor: 'border-blue-500',
		quoteColor: 'text-blue-500',
		bgGradient: 'from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600',
	},
	{
		content:
			'나이 차이가 많이 나지 않으신 분들이 오시다보니 학생들이 궁금해하는 진학방법, 사회초년생으로서의 직업 만족도 등을 편히 질문할 수 있어서 좋은 것 같습니다.',
		borderColor: 'border-purple-500',
		quoteColor: 'text-purple-500',
		bgGradient:
			'from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600',
	},
	{
		content:
			'같은 말이라도 선생님들이 이야기하면 잘 듣지 않는데, 아무래도 희망하는 직업을 가지신 분들이 이야기해 주시니 학생들이 더 느끼는게 많은 것 같아요^^',
		borderColor: 'border-indigo-500',
		quoteColor: 'text-indigo-500',
		bgGradient: 'from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-600',
	},
]

export const RECENT_ACTIVITIES: ActivityRecordProps[] = [
	{ date: '2024-12-27', school: '자양고', location: '서울특별시 광진구' },
	{
		date: '2024-12-22',
		school: '연탄봉사',
		location: '서울특별시 강남구 구룡마을',
	},
	{ date: '2024-09-07', school: '대원여고', location: '서울특별시 광진구' },
	{ date: '2024-08-17', school: '구현고', location: '서울특별시 구로구' },
	{ date: '2024-07-13', school: '풍생고', location: '경기도 성남시' },
	{ date: '2024-07-12', school: '보성고', location: '서울특별시 송파구' },
]

export const PREFERRED_TIME_SLOTS: TimeSlotProps[] = [
	{
		time: '금요일 저녁 7시',
		type: 'primary',
		color: 'text-blue-600 dark:text-blue-400',
		borderColor: 'border-blue-200 dark:border-blue-600',
	},
	{
		time: '토요일 오전 10시',
		type: 'primary',
		color: 'text-purple-600 dark:text-purple-400',
		borderColor: 'border-purple-200 dark:border-purple-600',
	},
]

export const OTHER_TIME_SLOTS: TimeSlotProps[] = [
	{
		time: '평일',
		type: 'secondary',
		color: 'text-gray-600 dark:text-gray-300',
		borderColor: 'border-gray-200 dark:border-gray-600',
	},
	{
		time: '일요일',
		type: 'secondary',
		color: 'text-gray-600 dark:text-gray-300',
		borderColor: 'border-gray-200 dark:border-gray-600',
	},
]

export const IMPACT_STATS: ImpactStatProps[] = [
	{
		icon: 'Smile',
		value: '95%',
		label: '학생 만족도',
		description: '참여 학생 설문조사 결과',
		gradient: 'from-green-500 to-emerald-600',
	},
	{
		icon: 'Users',
		value: '1,000+',
		label: '참여 학생 수',
		description: '누적 강연 참석 학생',
		gradient: 'from-blue-500 to-purple-600',
	},
	{
		icon: 'Target',
		value: '85%',
		label: '진로 도움도',
		description: '진로 선택에 도움됨',
		gradient: 'from-purple-500 to-pink-600',
	},
	{
		icon: 'Star',
		value: '4.8/5',
		label: '학교 평가',
		description: '참여 학교 만족도',
		gradient: 'from-orange-500 to-red-600',
	},
]

export const CONTACT_METHODS: ContactMethodProps[] = [
	{
		icon: 'Mail',
		label: '이메일',
		value: 'academi9@naver.com',
		type: 'email',
		href: 'mailto:academi9@naver.com',
	},
	{
		icon: 'kakao',
		label: '카카오톡',
		value: 'jhp00707',
		type: 'kakao',
	},
]

export const PROCESS_STEPS: ProcessStepProps[] = [
	{
		step: 1,
		title: '일정 수립',
		description:
			'모임장(운영진)과 학교 진로 담당 선생님이 함께 봉사 일정을 협의하여 결정합니다.',
		gradient: 'from-blue-500 to-purple-600',
	},
	{
		step: 2,
		title: '봉사 희망자 신청 취합',
		description:
			'키다리 선생님 단톡방에서 결정된 일정에 따라 참석 여부 투표를 진행합니다.',
		danger: {
			attention: '참고',
			title: '학교 요청 등에 따라 인원 제한이 있을 수 있습니다.',
		},
		additionalDescription:
			'봉사 신청이 마무리되면 실제 봉사 예정자들을 위한 별도 단톡방이 개설되어 상세 내용을 공지합니다.',
		gradient: 'from-purple-500 to-pink-600',
	},
	{
		step: 3,
		title: '교육 희망자 취합',
		description:
			'학교 진로 교육 선생님이 학생들의 교육 희망 분야를 취합합니다.',
		warning: {
			attention: '주의',
			title: '상황에 따라 신청하였더라도 교육이 진행되지 않을 수 있습니다.',
			items: [
				'• 교육 희망 학생 수가 너무 적은 경우',
				'• 동일 분야 강의자가 너무 많은 경우 등',
			],
		},
		gradient: 'from-green-500 to-blue-600',
	},
	{
		step: 4,
		title: '서류 제출 (필요시)',
		description: '교육 전 성범죄 조회 동의서 등 필요 서류를 제출합니다.',
		gradient: 'from-indigo-500 to-purple-600',
	},
	{
		step: 5,
		title: '교육 당일 진행',
		description: '봉사자가 직접 학교를 방문하여 진로 교육을 진행합니다.',
		note: {
			title: '당일 주의사항:',
			items: [
				'• 교육 시간 10분 전까지 도착 (진로 담당 선생님과 인사)',
				'• 교육 자료는 USB 또는 개인 노트북으로 준비',
			],
		},
		gradient: 'from-pink-500 to-red-600',
	},
]

export const GALLERY_PHOTOS: PhotoGalleryItemProps[] = [
	{
		src: '/images/main/lecture_001.png',
		alt: '키다리 선생님 메인 활동 현장',
		title: '직업 탐방 강연 현장',
		description: '고등학생들과 진로에 대해 진솔한 대화를 나누는 모습',
		aspectRatio: 'aspect-video sm:aspect-21/9',
		isMain: true,
	},
	{
		src: '/images/main/lecture_002.png',
		alt: '학생들과의 질의응답 시간',
		title: '질의응답 시간',
		description: '학생들의 적극적인 참여와 질문',
		aspectRatio: 'aspect-4/3',
	},
	{
		src: '/images/main/lecture_003.png',
		alt: '전문직 소개 및 경험 공유',
		title: '전문직 소개',
		description: '실무 경험과 노하우 전달',
		aspectRatio: 'aspect-4/3',
	},
]

export const SITE_INFO = {
	title: '키다리 선생님',
	subtitle: '전문직 봉사동아리',
	description:
		'진로, 적성, 전문직의 삶에 대해 전달하여 진로 선택에 도움을 주기 위한 사회인 봉사 동아리',
	mainDescription: '고등학생들에게 직업 탐방 강연 - 봉사활동으로 진행',
	logoAlt: '키다리 선생님 대표 이미지',
	cafeUrl: 'https://cafe.naver.com/provolunteer',
	copyright: '키다리 선생님 © 2025. All rights reserved.',
	mission: '고등학생들의 밝은 미래를 위해 함께 합니다.',
	email: 'academi9@naver.com',
	kakaoId: 'jhp00707',
} as const
