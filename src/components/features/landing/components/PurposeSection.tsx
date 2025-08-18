import { LinearContainer } from '@/components/ui/linear/linear-navigation'
import {
	LinearH2,
	LinearH4,
	LinearText,
	LinearTextSecondary,
} from '@/components/ui/linear/linear-typography'
import { SECTION_IDS } from '@/constants/landing'

export function PurposeSection() {
	return (
		<section id={SECTION_IDS.PURPOSE} className="py-20">
			<LinearContainer>
				<div className="max-w-4xl mx-auto text-center space-y-16">
					<div className="space-y-6">
						<LinearH2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
							활동 목적
						</LinearH2>
						<LinearText className="text-xl text-white/90 leading-loose tracking-wide max-w-3xl mx-auto">
							대학 진학을 앞둔 학생들에게 20~30대 전문직 종사자들이 직접 진로,
							적성, 직업 경험을 나누며 올바른 진로 선택을 돕습니다
						</LinearText>
					</div>

					<div className="space-y-12">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
							<div className="space-y-4">
								<LinearH4 className="text-xl font-semibold text-blue-400 tracking-wide">
									진로 탐색 지원
								</LinearH4>
								<LinearTextSecondary className="leading-loose tracking-wide text-white/80">
									학생들이 자신의 진로를 체계적으로 탐색할 수 있도록 전문직
									종사자들의 실제 경험과 조언을 제공
								</LinearTextSecondary>
							</div>

							<div className="space-y-4">
								<LinearH4 className="text-xl font-semibold text-green-400 tracking-wide">
									실무 경험 공유
								</LinearH4>
								<LinearTextSecondary className="leading-loose tracking-wide text-white/80">
									의사, 변호사, 회계사, IT개발자 등 다양한 전문직의 생생한 현장
									경험과 업무 내용을 직접 전달
								</LinearTextSecondary>
							</div>

							<div className="space-y-4">
								<LinearH4 className="text-xl font-semibold text-purple-400 tracking-wide">
									올바른 선택 도움
								</LinearH4>
								<LinearTextSecondary className="leading-loose tracking-wide text-white/80">
									학생들이 현명하고 올바른 진로 결정을 내릴 수 있도록 개인별
									상담과 체계적인 가이드를 제공
								</LinearTextSecondary>
							</div>
						</div>
					</div>

					<div className="space-y-6 pt-8 border-t border-white/10">
						<LinearText className="text-lg leading-loose tracking-wide text-white/85">
							키다리 선생님은 전문직 멘토링을 통해 학생들이 자신만의 꿈을 찾고
							실현할 수 있도록 돕는 것을 목표로 합니다.
							<br />
							단순한 정보 전달을 넘어서 학생들이 진정으로 원하는 삶의 방향을
							설정할 수 있도록 지원합니다.
						</LinearText>
					</div>
				</div>
			</LinearContainer>
		</section>
	)
}
