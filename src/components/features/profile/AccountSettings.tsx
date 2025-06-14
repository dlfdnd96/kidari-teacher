'use client'

import React, { memo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
	Settings,
	Trash2,
	LogOut,
	Shield,
	AlertTriangle,
	CheckCircle,
	X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { trpc } from '@/components/providers/TrpcProvider'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import type { AccountSettingsProps } from '@/types/profile'

const AccountSettings = memo(({ user }: AccountSettingsProps) => {
	const router = useRouter()
	const { showError } = useErrorModal()
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [confirmEmail, setConfirmEmail] = useState('')
	const [confirmText, setConfirmText] = useState('')

	const deleteAccountMutation = trpc.user.deleteAccount.useMutation({
		onSuccess: async () => {
			// 계정 삭제 성공 시 로그아웃
			await signOut({
				callbackUrl: '/',
				redirect: true,
			})
		},
		onError: (error) => {
			showError(error.message, '계정 삭제 오류')
		},
		onSettled: () => {
			setIsDeleteDialogOpen(false)
			setConfirmEmail('')
			setConfirmText('')
		},
	})

	const handleLogout = useCallback(async () => {
		await signOut({
			callbackUrl: '/',
			redirect: true,
		})
	}, [])

	const handleDeleteAccount = useCallback(async () => {
		if (confirmEmail !== user.email || confirmText !== '계정을 삭제합니다') {
			showError('확인 정보가 일치하지 않습니다.', '입력 오류')
			return
		}

		try {
			await deleteAccountMutation.mutateAsync({
				confirmEmail,
				confirmText,
			})
		} catch (error) {
			console.error('Delete account error:', error)
		}
	}, [confirmEmail, confirmText, user.email, deleteAccountMutation, showError])

	const canDeleteAccount =
		confirmEmail === user.email && confirmText === '계정을 삭제합니다'

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
								{user.role === 'ADMIN' ? '관리자' : '사용자'}
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

					{/* 계정 삭제 */}
					<div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
						<div>
							<div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
								계정 삭제
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								계정과 모든 데이터가 영구적으로 삭제됩니다
							</div>
						</div>
						<Button
							onClick={() => setIsDeleteDialogOpen(true)}
							variant="destructive"
							className="flex items-center"
						>
							<Trash2 className="w-4 h-4 mr-1.5" />
							계정 삭제
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

			{/* 계정 삭제 확인 다이얼로그 */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center text-red-600 dark:text-red-400">
							<AlertTriangle className="w-5 h-5 mr-2" />
							계정 삭제 확인
						</DialogTitle>
						<DialogDescription className="text-left">
							이 작업은 되돌릴 수 없습니다. 계정과 모든 데이터가 영구적으로
							삭제됩니다.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* 진행 중인 활동 경고 */}
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								진행 중인 봉사활동이 있는 경우 계정을 삭제할 수 없습니다.
							</AlertDescription>
						</Alert>

						{/* 이메일 확인 */}
						<div>
							<label
								htmlFor="confirm-email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								이메일 주소를 입력하여 확인해주세요:
							</label>
							<Input
								id="confirm-email"
								type="email"
								placeholder={user.email ?? ''}
								value={confirmEmail}
								onChange={(e) => setConfirmEmail(e.target.value)}
								className="w-full"
							/>
						</div>

						{/* 텍스트 확인 */}
						<div>
							<label
								htmlFor="confirm-text"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								다음 텍스트를 정확히 입력해주세요:{' '}
								<span className="font-bold text-red-600">
									"계정을 삭제합니다"
								</span>
							</label>
							<Input
								id="confirm-text"
								type="text"
								placeholder="계정을 삭제합니다"
								value={confirmText}
								onChange={(e) => setConfirmText(e.target.value)}
								className="w-full"
							/>
						</div>

						{/* 확인 상태 표시 */}
						<div className="space-y-2 text-sm">
							<div className="flex items-center">
								{confirmEmail === user.email ? (
									<CheckCircle className="w-4 h-4 text-green-600 mr-2" />
								) : (
									<X className="w-4 h-4 text-red-600 mr-2" />
								)}
								<span
									className={
										confirmEmail === user.email
											? 'text-green-600'
											: 'text-red-600'
									}
								>
									이메일 확인
								</span>
							</div>
							<div className="flex items-center">
								{confirmText === '계정을 삭제합니다' ? (
									<CheckCircle className="w-4 h-4 text-green-600 mr-2" />
								) : (
									<X className="w-4 h-4 text-red-600 mr-2" />
								)}
								<span
									className={
										confirmText === '계정을 삭제합니다'
											? 'text-green-600'
											: 'text-red-600'
									}
								>
									텍스트 확인
								</span>
							</div>
						</div>
					</div>

					<DialogFooter className="flex flex-col sm:flex-row gap-2">
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
							disabled={deleteAccountMutation.isPending}
							className="flex-1"
						>
							취소
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteAccount}
							disabled={!canDeleteAccount || deleteAccountMutation.isPending}
							className="flex-1"
						>
							{deleteAccountMutation.isPending ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
									삭제 중...
								</>
							) : (
								<>
									<Trash2 className="w-4 h-4 mr-1.5" />
									계정 삭제
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
})

AccountSettings.displayName = 'AccountSettings'

export default AccountSettings
