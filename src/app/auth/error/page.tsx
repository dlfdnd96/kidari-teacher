'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
	const searchParams = useSearchParams()
	const error = searchParams?.get('error')

	let message = '알 수 없는 오류가 발생했습니다.'
	if (error === 'OAuthAccountNotLinked') {
		message =
			'이미 다른 소셜 계정으로 가입된 이메일입니다. 기존에 사용한 소셜 계정으로 로그인해주세요.'
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-2xl font-bold mb-4">로그인 오류</h1>
			<p className="mb-4">{message}</p>
			<Link href="/" className="text-blue-500 underline">
				메인으로 돌아가기
			</Link>
		</div>
	)
}
