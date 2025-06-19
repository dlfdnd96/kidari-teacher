'use client'

import { useAuthRedirect } from '@/hooks/useAuthRedirect'

export default function AuthRedirectHandler() {
	useAuthRedirect()
	return null
}
