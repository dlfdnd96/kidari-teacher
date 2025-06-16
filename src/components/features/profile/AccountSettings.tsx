'use client'

import React, { memo, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import { Settings, LogOut, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { AccountSettingsProps } from '@/types/profile'
import { Enum } from '@/enums'

const AccountSettings = memo(({ user }: AccountSettingsProps) => {
	const handleLogout = useCallback(async () => {
		await signOut({
			callbackUrl: '/',
			redirect: true,
		})
	}, [])

	return (
		<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
			{/* 헤더 */}
			<div className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 p-6 sm:p-8">
				<div className="flex items-center">
					<Settings className="w-7 h-7 text-white mr-3" />
					<div>
						<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
							계정 설정
						</h2>
						<p className="text-gray-100 text-sm">계정 관련 설정을 관리하세요</p>
					</div>
				</div>
			</div>

			{/* 설정 내용 */}
			<div className="p-6 sm:p-8 space-y-6">
				{/* 계정 정보 */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
						<Shield className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
						계정 정보
					</h3>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
							<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
								역할
							</div>
							<div className="text-base font-semibold text-gray-900 dark:text-gray-100">
								{user.role === Enum.Role.ADMIN ? '관리자' : '사용자'}
							</div>
						</div>

						<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
							<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
								로그인 방식
							</div>
							<div className="text-base font-semibold text-gray-900 dark:text-gray-100">
								소셜 로그인
							</div>
						</div>
					</div>
				</div>

				{/* 계정 액션 */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						계정 액션
					</h3>

					{/* 로그아웃 */}
					<div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
						<div>
							<div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
								로그아웃
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								현재 세션에서 로그아웃합니다
							</div>
						</div>
						<Button
							onClick={handleLogout}
							variant="outline"
							className="flex items-center border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
						>
							<LogOut className="w-4 h-4 mr-1.5" />
							로그아웃
						</Button>
					</div>
				</div>

				{/* 주의사항 */}
				<Alert>
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription>
						소셜 로그인 계정의 경우 비밀번호 변경은 해당 서비스(구글, 카카오,
						네이버)에서 직접 진행해주세요.
					</AlertDescription>
				</Alert>
			</div>
		</div>
	)
})

AccountSettings.displayName = 'AccountSettings'

export default AccountSettings
