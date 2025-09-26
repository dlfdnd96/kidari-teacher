import { memo } from 'react'
import { PROFESSION_TAGS, SECTION_IDS } from '@/constants/landing'
import { Container } from '@/components/ui/container'

const TagCloud = memo(() => {
	return (
		<div className="flex flex-wrap items-center gap-2 justify-center">
			{PROFESSION_TAGS.map((tag) => (
				<span
					className="h-12 px-6 inline-flex items-center font-medium text-base tracking-tight rounded-xl focus-visible:ring-ring border border-input bg-secondary hover:bg-accent hover:text-accent-foreground text-foreground"
					key={tag.id}
				>
					{tag.label}
				</span>
			))}
		</div>
	)
})

TagCloud.displayName = 'TagCloud'

export function MembersSection() {
	return (
		<section id={SECTION_IDS.MEMBERS} className="py-20">
			<Container>
				<div className="text-center mb-16">
					<h2 className="text-5xl font-bold tracking-tight text-foreground leading-relaxed">
						구성원
					</h2>
					<p className="text-lg text-foreground/90 leading-loose tracking-wide max-w-2xl mx-auto mt-4">
						다양한 전문직 멘토 약 100명이 학생들의 진로 탐색을 함께합니다
					</p>
				</div>

				<div className="max-w-4xl mx-auto px-8">
					<TagCloud />
				</div>
			</Container>
		</section>
	)
}
