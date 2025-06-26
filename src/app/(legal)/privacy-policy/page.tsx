import { memo } from 'react'

const PrivacyPolicyPage = memo(() => {
	return (
		<div className="max-w-3xl mx-auto px-4 py-12">
			<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-12 text-center">
				개인정보 처리방침
			</h1>

			{/* Content */}
			<div className="prose prose-gray max-w-none dark:prose-invert">
				<section className="mb-12">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
						1. 개인정보의 수집 및 이용 목적
					</h2>
					<p className="text-gray-700 dark:text-gray-300 mb-4">
						{`키다리 선생님(이하 "동아리")은 수집한 개인정보를 다음의 목적을 위해
						활용합니다.`}
					</p>
					<ul className="text-gray-700 dark:text-gray-300 space-y-2">
						<li>• 회원 관리 및 본인 확인</li>
						<li>• 동아리 활동 안내 및 공지 전달</li>
						<li>• 동아리 서비스 제공 및 운영</li>
					</ul>
				</section>

				<section className="mb-12">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
						2. 개인정보의 보유 및 이용기간
					</h2>

					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
							소비자의 불만 또는 분쟁처리에 관한 기록
						</h3>
						<p className="text-gray-700 dark:text-gray-300 mb-1">
							보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률 제6조 및
							시행령 제6조
						</p>
						<p className="text-gray-700 dark:text-gray-300">보존 기간: 3년</p>
					</div>

					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
							본인확인에 관한 기록
						</h3>
						<p className="text-gray-700 dark:text-gray-300 mb-1">
							보존 이유: 정보통신망 이용촉진 및 정보보호에 관한 법률 제44조의5
							및 시행령 제29조
						</p>
						<p className="text-gray-700 dark:text-gray-300">보존 기간: 6개월</p>
					</div>

					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
							접속에 관한 기록
						</h3>
						<p className="text-gray-700 dark:text-gray-300 mb-1">
							보존 이유: 통신비밀보호법 제15조의2 및 시행령 제41조
						</p>
						<p className="text-gray-700 dark:text-gray-300">보존 기간: 3개월</p>
					</div>
				</section>

				<section className="mb-12">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
						3. 수집하는 개인정보의 항목
					</h2>
					<p className="text-gray-700 dark:text-gray-300 mb-6">
						동아리는 소셜 로그인 서비스를 통해 아래와 같은 개인정보를 수집하고
						있습니다.
					</p>

					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							1. 수집항목
						</h3>
						<p className="text-gray-700 dark:text-gray-300 mb-3">사용자 입력</p>
						<ul className="text-gray-700 dark:text-gray-300 space-y-1 mb-6">
							<li>• 이메일: 사용자의 구분 및 연락을 위함</li>
							<li>• 이름: 동아리 활동에서 회원 정보를 보여주기 위함</li>
							<li>• 생년월일: 회원 관리를 위함</li>
							<li>
								• 프로필 이미지: 동아리 활동에서 회원 정보를 보여주기 위함
							</li>
							<li>• 핸드폰번호: 긴급 연락을 위함</li>
							<li>• 직장주소: 회원 관리를 위함</li>
						</ul>
						<p className="text-gray-700 dark:text-gray-300 mb-6">
							자동 수집항목: IP 정보, 이용 기록, 접속 로그, 쿠키, 접속 기록 등
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
							2. 개인정보 수집방법
						</h3>
						<p className="text-gray-700 dark:text-gray-300">
							소셜 로그인 서비스(구글, 네이버, 카카오 등), 홈페이지(프로필 작성)
						</p>
					</div>
				</section>

				<section className="mb-12">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
						4. 개인정보의 파기절차 및 방법
					</h2>
					<p className="text-gray-700 dark:text-gray-300 mb-4">
						이용자는 개인정보 관리 책임자(7조 참고)에게 이메일을 발송하여 탈퇴
						요청을 할 수 있습니다.
					</p>
					<p className="text-gray-700 dark:text-gray-300 mb-4">
						또한, 기업의 개인정보 이메일로 사용해야 개인정보 관리 책임자가
						즉시에게 이메일을 발송하여 탈퇴 요청을 할 수 있습니다.
					</p>

					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
						파기절차
					</h3>
					<p className="text-gray-700 dark:text-gray-300">
						탈퇴처리가 진행되면 수집된 개인정보와 해당 회원의 모든 활동 기록이
						삭제됩니다.
					</p>
				</section>

				<section className="mb-12">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
						5. 개인정보 제공
					</h2>
					<p className="text-gray-700 dark:text-gray-300 mb-4">
						동아리는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
						다만, 아래의 경우에는 예외로 합니다.
					</p>
					<ul className="text-gray-700 dark:text-gray-300 space-y-2">
						<li>• 이용자들이 사전에 동의한 경우</li>
						<li>
							• 법령의 규정에 의거하거나, 수사 목적으로 수사기관의 요구가 있는
							경우
						</li>
					</ul>
				</section>

				<section className="mb-12">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
						6. 개인정보의 안전성 확보조치에 관한 사항
					</h2>
					<p className="text-gray-700 dark:text-gray-300 mb-3">
						1) 개인정보 암호화
					</p>
					<p className="text-gray-700 dark:text-gray-300 mb-3">
						2) 해킹 등에 대비한 대책
					</p>
					<p className="text-gray-700 dark:text-gray-300">
						3) 취급 직원의 최소화 및 교육
					</p>
				</section>

				<section className="mb-12">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
						7. 개인정보 관리 책임자 및 담당자
					</h2>
					<p className="text-gray-700 dark:text-gray-300 mb-1">성명: 박재현</p>
					<p className="text-gray-700 dark:text-gray-300 mb-6">
						이메일:{' '}
						<a
							href="mailto:academi9@naver.com"
							className="text-teal-500 hover:underline"
						>
							academi9@naver.com
						</a>
					</p>

					<p className="text-gray-700 dark:text-gray-300 mb-4">
						기타 개인정보침해에 대한 신고나 상담이 필요한 경우에는 아래 기관에
						문의하시기 바랍니다.
					</p>
					<p className="text-gray-700 dark:text-gray-300">
						개인정보침해신고센터 (privacy.go.kr / 국번없이 182)
					</p>
				</section>

				<section className="mb-12">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
						8. 개인정보 처리방침 변경에 관한 사항
					</h2>
					<p className="text-gray-700 dark:text-gray-300 mb-4">
						이 개인정보 처리방침은 2025년 7월부터 적용됩니다.
					</p>
					<p className="text-gray-700 dark:text-gray-300">
						변경이전의 개인정보 처리방침은 과거이력으로 기록됩니다.
					</p>
				</section>
			</div>
		</div>
	)
})

PrivacyPolicyPage.displayName = 'PrivacyPolicyPage'

export default PrivacyPolicyPage
