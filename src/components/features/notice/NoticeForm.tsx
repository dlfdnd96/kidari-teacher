'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NoticeForm() {
	const { register, handleSubmit, reset, formState } = useForm()
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)
	const router = useRouter()

	const onSubmit = async (data: any) => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch('/api/notice', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			const result = await res.json()
			if (!res.ok) throw new Error(result.error || '등록 실패')
			reset()
			router.refresh()
		} catch (e: any) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="mb-8 p-4 bg-white rounded-xl shadow flex flex-col gap-4 border"
		>
			<h2 className="text-lg font-bold mb-2">공지사항 등록</h2>
			<Input
				{...register('title', { required: true })}
				placeholder="제목"
				disabled={loading}
			/>
			<Textarea
				{...register('content', { required: true })}
				placeholder="내용"
				rows={5}
				disabled={loading}
			/>
			{error && <div className="text-red-500 text-sm">{error}</div>}
			<Button type="submit" disabled={loading || formState.isSubmitting}>
				{loading ? '등록 중...' : '등록'}
			</Button>
		</form>
	)
}
