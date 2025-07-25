import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/components/providers/TrpcProvider'
import {
	CLIENT_ERROR_KEY_MAPPING,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { formatPhoneNumber, removePhoneNumberFormat } from '@/utils/phone'
import { ZodEnum } from '@/enums'
import { ZodType } from '@/shared/types'
import { CreateUserProfileFormSchema } from '@/shared/schemas/user'

export const useProfileSetup = () => {
	const { data: session, status, update: updateSession } = useSession()
	const router = useRouter()
	const { showError } = useErrorModal()

	const [displayPhone, setDisplayPhone] = useState<string>('')
	const [selectedProfessions, setSelectedProfessions] = useState<
		ZodType<typeof ZodEnum.Profession>[]
	>([])

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(CreateUserProfileFormSchema),
	})

	useEffect(() => {
		if (status === 'authenticated' && session?.user) {
			setValue('name', session.user.name ?? '')
			setValue('email', session.user.email ?? '')
		}
	}, [session, status, setValue])

	const initializeUserProfileMutation =
		trpc.userProfile.initializeUserProfile.useMutation({
			onError: (error) => {
				handleClientError(error, showError, '프로필 등록 오류')
			},
		})

	const handlePhoneChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value
			const formatted = formatPhoneNumber(value)
			setDisplayPhone(formatted)

			const numbersOnly = removePhoneNumberFormat(formatted)
			setValue('phone', numbersOnly)
		},
		[setValue],
	)

	const handleProfessionsChange = useCallback(
		(professions: ZodType<typeof ZodEnum.Profession>[]) => {
			setSelectedProfessions(professions)
			setValue('professions', professions)
		},
		[setValue],
	)

	const onSubmit = useCallback(
		async (data: ZodType<typeof CreateUserProfileFormSchema>) => {
			if (!session?.user) {
				handleClientError(
					CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
					showError,
					'사용자 인증 오류',
				)
				return
			}

			try {
				const formData = {
					...data,
					professions: selectedProfessions,
				}
				const result = await initializeUserProfileMutation.mutateAsync(formData)

				if (result) {
					await updateSession({
						user: {
							...session?.user,
							name: data.name,
						},
					})
					router.push('/')
				}
			} catch (error: unknown) {
				if (isValidationError(error)) {
					handleClientError(error, showError, '입력 정보 검증 오류')
				} else {
					handleClientError(
						error,
						showError,
						'프로필 등록 중 오류가 발생했습니다',
					)
				}
			}
		},
		[
			session?.user,
			showError,
			selectedProfessions,
			initializeUserProfileMutation,
			updateSession,
			router,
		],
	)

	const isLoading = initializeUserProfileMutation.isPending || isSubmitting

	return {
		displayPhone,
		selectedProfessions,
		isLoading,
		errors,
		register,
		handleSubmit,
		onSubmit,
		handlePhoneChange,
		handleProfessionsChange,
	}
}
