'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface NoticeEditFormProps {
	id: string
	initialTitle: string
	initialContent: string
	onCancel: () => void
}

export default function NoticeEditForm({
	id,
	initialTitle,
	initialContent,
	onCancel,
}: NoticeEditFormProps) {
	const { register, handleSubmit, formState, setValue } = useForm({
		defaultValues: { title: initialTitle, content: initialContent },
	})
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)
	const router = useRouter()

	const onSubmit = async (data: any) => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(`/api/notice/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			const result = await res.json()
			if (!res.ok) throw new Error(result.error || '수정 실패')
			router.refresh()
			onCancel()
		} catch (e: any) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="mb-4 p-4 bg-white rounded-xl shadow flex flex-col gap-4 border"
		>
			<h2 className="text-lg font-bold mb-2">공지사항 수정</h2>
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
			<div className="flex gap-2">
				<Button type="submit" disabled={loading || formState.isSubmitting}>
					{loading ? '수정 중...' : '수정'}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={loading}
				>
					취소
				</Button>
			</div>
		</form>
	)
}
