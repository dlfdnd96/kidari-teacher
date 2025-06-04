'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import NoticeEditForm from './NoticeEditForm'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export interface NoticeCardProps {
	notice: {
		id: string
		title: string
		content: string
		author: {
			name?: string | null
		}
		createdAt: string
	}
}

export default function NoticeCard({ notice }: NoticeCardProps) {
	const { data: session } = useSession()
	const isAdmin = session?.user?.role === 'ADMIN'
	const [editing, setEditing] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		if (!window.confirm('정말 삭제하시겠습니까?')) return
		try {
			const res = await fetch(`/api/notice/${notice.id}`, { method: 'DELETE' })
			const result = await res.json()
			if (!res.ok) throw new Error(result.error || '삭제 실패')
			router.refresh()
		} catch (e: any) {
			window.alert(e.message)
		}
	}

	if (editing) {
		return (
			<NoticeEditForm
				id={notice.id}
				initialTitle={notice.title}
				initialContent={notice.content}
				onCancel={() => setEditing(false)}
			/>
		)
	}

	return (
		<Card className="mb-4 p-4 shadow-md hover:shadow-lg transition-shadow">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h3
						className="text-lg font-bold text-blue-700 truncate"
						title={notice.title}
					>
						{notice.title}
					</h3>
					{isAdmin && (
						<div className="flex gap-2">
							<button
								className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-blue-100 text-blue-700 border border-blue-200"
								onClick={() => setEditing(true)}
								type="button"
							>
								수정
							</button>
							<button
								className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-red-100 text-red-700 border border-red-200"
								onClick={handleDelete}
								type="button"
							>
								삭제
							</button>
						</div>
					)}
				</div>
				<p className="text-gray-700 text-sm line-clamp-2">{notice.content}</p>
				<div className="flex items-center justify-between mt-2 text-xs text-gray-500">
					<span>작성자: {notice.author?.name ?? '관리자'}</span>
					<span>{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
				</div>
			</div>
		</Card>
	)
}
