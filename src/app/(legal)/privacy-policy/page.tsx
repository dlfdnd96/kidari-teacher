import { memo } from 'react'

const PrivacyPolicyPage = memo(() => {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Header */}
				<div className="mb-12">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
						개인정보 처리방침
					</h1>
				</div>

				{/* Content */}
				<div className="prose prose-lg max-w-none dark:prose-invert">
					{/* Introduction */}
					<div className="mb-8">
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							{`키다리 선생님(이하 "동아리")은 소셜 로그인을 통해 회원님의
							개인정보를 수집·이용하며, 관련 법령을 준수하여 개인정보를 안전하게
							관리합니다.`}
						</p>
					</div>

					{/* Section 1 */}
					<section className="mb-8">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							1. 수집하는 개인정보 항목
						</h2>
						<p className="text-gray-700 dark:text-gray-300 mb-3">
							동아리는 소셜 로그인 서비스를 통해 아래와 같은 개인정보를
							수집합니다.
						</p>
						<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
							<li>이름</li>
							<li>이메일</li>
							<li>생년월일</li>
							<li>프로필 이미지</li>
							<li>핸드폰번호</li>
							<li>직장주소</li>
						</ul>
					</section>

					{/* Section 2 */}
					<section className="mb-8">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							2. 개인정보 수집 및 이용 목적
						</h2>
						<p className="text-gray-700 dark:text-gray-300 mb-3">
							동아리는 수집한 개인정보를 다음의 목적을 위해 이용합니다.
						</p>
						<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
							<li>회원 관리 및 본인 확인</li>
							<li>동아리 활동 안내 및 공지 전달</li>
							<li>동아리 서비스 제공 및 운영</li>
						</ul>
					</section>

					{/* Section 3 */}
					<section className="mb-8">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							3. 개인정보 수집 방법
						</h2>
						<p className="text-gray-700 dark:text-gray-300">
							동아리는 별도의 회원가입 절차 없이 구글, 네이버, 카카오 등 소셜
							로그인 기능을 통해서만 개인정보를 수집합니다.
						</p>
					</section>

					{/* Section 4 */}
					<section className="mb-8">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							4. 개인정보의 보유 및 이용 기간
						</h2>
						<p className="text-gray-700 dark:text-gray-300">
							동아리는 회원 탈퇴 시 또는 개인정보 수집 및 이용 목적이 달성된
							후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 따라
							보존이 필요한 경우에는 해당 기간 동안 안전하게 보관합니다.
						</p>
					</section>

					{/* Section 5 */}
					<section className="mb-8">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							5. 개인정보의 제3자 제공
						</h2>
						<p className="text-gray-700 dark:text-gray-300">
							동아리는 회원의 동의 없이 개인정보를 외부에 제공하지 않습니다.
						</p>
					</section>

					{/* Section 6 */}
					<section className="mb-8">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							6. 개인정보 보호 책임자
						</h2>
						<p className="text-gray-700 dark:text-gray-300 mb-3">
							동아리는 법인이나 단체가 아닌 개인 동아리로, 개인정보 보호
							책임자는 아래와 같습니다.
						</p>
						<p className="text-gray-700 dark:text-gray-300">
							책임자: 박재현
							<br />
							이메일:{' '}
							<a
								href="mailto:academi9@naver.com"
								className="text-blue-600 dark:text-blue-400 hover:underline"
							>
								academi9@naver.com
							</a>
						</p>
					</section>

					{/* Section 7 */}
					<section className="mb-8">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							7. 기타
						</h2>
						<p className="text-gray-700 dark:text-gray-300">
							회원님은 언제든지 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.
							기타 개인정보 관련 문의는 위 연락처로 문의해 주시기 바랍니다.
						</p>
					</section>

					{/* Footer */}
					<div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-12">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							본 개인정보 처리방침은 2025년 1월부터 적용됩니다.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
})

PrivacyPolicyPage.displayName = 'PrivacyPolicyPage'

export default PrivacyPolicyPage
