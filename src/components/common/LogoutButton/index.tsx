'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

export default function LogoutButton() {
	const [isLoading, setIsLoading] = useState(false)

	const handleLogout = async () => {
		setIsLoading(true)
		try {
			await signOut()
		} catch (error) {
			console.error('로그아웃 오류:', error)
			setIsLoading(false)
		}
	}

	return (
		<button
			type="button"
			onClick={handleLogout}
			disabled={isLoading}
			className="px-6 py-2.5 bg-linear-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
		>
			{isLoading ? (
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
					<span>로그아웃 중...</span>
				</div>
			) : (
				'로그아웃'
			)}
		</button>
	)
}
