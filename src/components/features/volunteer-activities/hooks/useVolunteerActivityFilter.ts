import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const useVolunteerActivityFilter = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const updateURL = useCallback(
		(params: { status?: string | 'all'; page?: number; search?: string }) => {
			const url = new URL(window.location.href)

			// 기존 파라미터 유지
			const currentParams = new URLSearchParams(searchParams?.toString() || '')

			// 새로운 파라미터 적용
			if (params.status && params.status !== 'all') {
				currentParams.set('status', params.status)
			} else {
				currentParams.delete('status')
			}

			if (params.page && params.page > 1) {
				currentParams.set('page', params.page.toString())
			} else {
				currentParams.delete('page')
			}

			if (params.search && params.search.trim()) {
				currentParams.set('search', params.search.trim())
			} else {
				currentParams.delete('search')
			}

			const newUrl = `${url.pathname}?${currentParams.toString()}`
			router.push(newUrl)
		},
		[router, searchParams],
	)

	const updateURLImmediate = useCallback(
		(params: { status?: string | 'all'; page?: number; search?: string }) => {
			updateURL(params)
		},
		[updateURL],
	)

	const getFilterFromURL = useCallback(() => {
		const status = searchParams?.get('status') || 'all'
		const page = parseInt(searchParams?.get('page') || '1', 10)
		const search = searchParams?.get('search') || ''

		return { status, page, search }
	}, [searchParams])

	const filterState = useMemo(() => getFilterFromURL(), [getFilterFromURL])

	return {
		updateURL,
		updateURLImmediate,
		getFilterFromURL,
		filterState,
	}
}
