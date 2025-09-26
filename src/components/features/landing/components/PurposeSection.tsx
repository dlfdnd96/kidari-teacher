import { SECTION_IDS } from '@/constants/landing'
import { Container } from '@/components/ui/container'

export function PurposeSection() {
	return (
		<section id={SECTION_IDS.PURPOSE} className="py-20">
			<Container>
				<div className="max-w-4xl mx-auto text-center space-y-16">
					<div className="space-y-6">
						<h2 className="text-5xl font-bold tracking-tight text-foreground leading-relaxed">
							활동 목적
						</h2>
						<p className="text-xl text-foreground/90 leading-loose tracking-wide max-w-3xl mx-auto">
							대학 진학을 앞둔 학생들에게 20~30대 전문직 종사자들이 직접 진로,
							적성, 직업 경험을 나누며 올바른 진로 선택을 돕습니다
						</p>
					</div>

					<div className="space-y-12">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
							<div className="space-y-4">
								<h4 className="text-xl font-semibold text-blue-400 tracking-wide md:text-base leading-relaxed">
									진로 탐색 지원
								</h4>
								<p className="leading-loose tracking-wide text-foreground/80 text-sm">
									학생들이 자신의 진로를 체계적으로 탐색할 수 있도록 전문직
									종사자들의 실제 경험과 조언을 제공
								</p>
							</div>

							<div className="space-y-4">
								<h4 className="text-xl font-semibold text-green-400 md:text-base leading-relaxed tracking-tight">
									실무 경험 공유
								</h4>
								<p className="leading-loose tracking-wide text-foreground/80 text-sm">
									의사, 변호사, 회계사, IT개발자 등 다양한 전문직의 생생한 현장
									경험과 업무 내용을 직접 전달
								</p>
							</div>

							<div className="space-y-4">
								<h4 className="text-xl font-semibold text-purple-400 md:text-base leading-relaxed tracking-tight">
									올바른 선택 도움
								</h4>
								<p className="leading-loose tracking-wide text-foreground/80 text-sm">
									학생들이 현명하고 올바른 진로 결정을 내릴 수 있도록 개인별
									상담과 체계적인 가이드를 제공
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-6 pt-8 border-t border-foreground/10">
						<p className="text-lg leading-loose tracking-wide text-foreground/85">
							키다리 선생님은 전문직 멘토링을 통해 학생들이 자신만의 꿈을 찾고
							실현할 수 있도록 돕는 것을 목표로 합니다.
							<br />
							단순한 정보 전달을 넘어서 학생들이 진정으로 원하는 삶의 방향을
							설정할 수 있도록 지원합니다.
						</p>
					</div>
				</div>
			</Container>
		</section>
	)
}
