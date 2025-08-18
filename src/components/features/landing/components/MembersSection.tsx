import { LinearContainer } from '@/components/ui/linear/linear-navigation'
import { LinearH2, LinearText } from '@/components/ui/linear/linear-typography'
import { LinearTagCloud } from '@/components/ui/linear/linear-tag-cloud'
import { PROFESSION_TAGS, SECTION_IDS } from '@/constants/landing'

export function MembersSection() {
	return (
		<section id={SECTION_IDS.MEMBERS} className="py-20 bg-[#0A0A0A]">
			<LinearContainer>
				<div className="text-center mb-16">
					<LinearH2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
						구성원
					</LinearH2>
					<LinearText className="text-lg text-white/90 leading-loose tracking-wide max-w-2xl mx-auto mt-4">
						다양한 전문직 멘토 약 100명이 학생들의 진로 탐색을 함께합니다
					</LinearText>
				</div>

				<div className="max-w-4xl mx-auto px-8">
					<LinearTagCloud
						tags={PROFESSION_TAGS}
						spacing="normal"
						className="justify-center"
					/>
				</div>
			</LinearContainer>
		</section>
	)
}
