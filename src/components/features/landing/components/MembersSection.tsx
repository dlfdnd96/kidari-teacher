import { PROFESSION_TAGS, SECTION_IDS } from '@/constants/landing'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { memo } from 'react'

const TagCloud = memo(() => {
	return (
		<div className="flex flex-wrap items-center gap-2 justify-center">
			{PROFESSION_TAGS.map((tag) => (
				<span
					className={cn(
						'inline-flex items-center justify-center whitespace-nowrap font-medium select-none',
						'transition-all duration-150 ease-out hover:scale-105 active:scale-95',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
						'bg-[#E6E6E6]/10 text-[#E6E6E6] border border-[#E6E6E6]/20',
						'hover:bg-[#2D2E37] hover:text-[#F7F8F8]',
						'h-12 px-6 text-lg rounded-xl',
					)}
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
		<section id={SECTION_IDS.MEMBERS} className="py-20 bg-[#0A0A0A]">
			<Container>
				<div className="text-center mb-16">
					<h2 className="text-5xl font-bold tracking-tight text-white leading-relaxed">
						구성원
					</h2>
					<p className="text-lg text-white/90 leading-loose tracking-wide max-w-2xl mx-auto mt-4">
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
