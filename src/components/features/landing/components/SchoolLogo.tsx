import Image from 'next/image'
import { SCHOOL_LOGOS } from '@/constants/landing'

interface SchoolLogo {
	src: string
	alt: string
	width: number
	height: number
}

const LOGO_COMMON_CLASS =
	'opacity-60 hover:opacity-100 transition-opacity duration-300 filter brightness-0 invert'

const generateLogoKey = (logo: SchoolLogo, index: number): string => {
	const uniqueId =
		logo.src
			.split('/')
			.pop()
			?.replace(/\.[^/.]+$/, '') || 'logo'
	return `${uniqueId}-${index}`
}

export function SchoolLogo() {
	const renderSchoolLogo = (logo: SchoolLogo, index: number) => {
		const logoKey = generateLogoKey(logo, index)

		return (
			<div key={logoKey} className="flex justify-center">
				<Image
					src={logo.src}
					alt={logo.alt}
					width="0"
					height="0"
					style={{ width: logo.width, height: logo.height }}
					className={LOGO_COMMON_CLASS}
					loading="lazy"
					onError={(e) => {
						console.warn(`로고 로딩 실패: ${logo.src}`)
						e.currentTarget.style.display = 'none'
					}}
				/>
			</div>
		)
	}

	return (
		<div className="max-w-6xl mx-auto mt-24">
			<div className="text-center mb-16">
				<h3 className="text-2xl font-semibold text-slate-50 text-center leading-relaxed tracking-tight">
					협력 학교
				</h3>
				<p className="text-lg leading-loose tracking-wide text-white/80 max-w-4xl mx-auto mt-4">
					다양한 학교에서 지속적인 진로 멘토링을 통해
					<br />더 많은 학생들이 진로에 대해 함께 고민할 수 있도록 돕고 있습니다
				</p>
			</div>

			<div
				className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center"
				role="img"
				aria-label="협력 학교 로고 목록"
			>
				{SCHOOL_LOGOS.map(renderSchoolLogo)}
			</div>
		</div>
	)
}
