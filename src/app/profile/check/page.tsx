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
		error,
	} = trpc.userProfile.hasUserProfile.useQuery(undefined, {
		enabled: !!session?.user?.id,
		retry: false,
	})

	useEffect(() => {
		if (status === 'loading') {
			return
		} else if (status === 'unauthenticated' || error) {
			router.push('/')
			return
		}

		if (profileCheck && !isLoading) {
			if (profileCheck.hasProfile) {
				router.back()
			} else {
				router.push('/profile/setup')
			}
		}
	}, [profileCheck, isLoading, status, error, router])

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="space-y-4">
				<Skeleton className="h-4 w-48" />
				<Skeleton className="h-4 w-32" />
			</div>
		</div>
	)
}
