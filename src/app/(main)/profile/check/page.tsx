'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/components/providers/TrpcProvider'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileCheckPage() {
	const { data: session, status } = useSession()
	const router = useRouter()

	const {
		data: profileCheck,
		isLoading,
		error: trpcError,
	} = trpc.userProfile.hasUserProfile.useQuery(undefined, {
		enabled: !!session?.user?.id,
		retry: false,
	})

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const error = urlParams.get('error')
		const returnTo = urlParams.get('returnTo')

		if (error) {
			router.push(`/auth/error?error=${error}`)
			return
		}

		if (status === 'loading') {
			return
		} else if (status === 'unauthenticated' || trpcError) {
			router.push('/')
			return
		}

		if (profileCheck && !isLoading) {
			if (profileCheck.hasProfile) {
				router.push(returnTo || '/')
			} else {
				router.push('/profile/setup')
			}
		}
	}, [profileCheck, isLoading, status, trpcError, router])

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="space-y-4">
				<Skeleton className="h-4 w-48" />
				<Skeleton className="h-4 w-32" />
			</div>
		</div>
	)
}
