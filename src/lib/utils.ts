import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod/v4-mini'

/**
 * Tailwind CSS 클래스를 안전하게 합치는 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * 전화번호 포맷팅 (010-1234-5678)
 */
export function formatPhoneNumber(phone: string): string {
	const cleaned = phone.replace(/\D/g, '')
	const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/)

	if (match) {
		return `${match[1]}-${match[2]}-${match[3]}`
	}

	return phone
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD → YYYY년 MM월 DD일)
 */
export function formatDate(dateString: string): string {
	const [year, month, day] = dateString.split('-')
	return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
}

/**
 * 숫자를 한국어 단위로 포맷팅 (1000 → 1천)
 */
export function formatNumberToKorean(num: number): string {
	if (num >= 10000) {
		return `${Math.floor(num / 10000)}만${num % 10000 ? `${Math.floor((num % 10000) / 1000)}천` : ''}`
	} else if (num >= 1000) {
		return `${Math.floor(num / 1000)}천${num % 1000 ? Math.floor(num % 1000) : ''}`
	}
	return num.toString()
}

/**
 * 스크롤 위치에 따른 요소 표시/숨김 처리
 */
export function getScrollVisibility(element: Element): boolean {
	const rect = element.getBoundingClientRect()
	const windowHeight =
		window.innerHeight || document.documentElement.clientHeight

	return rect.top <= windowHeight * 0.75 && rect.bottom >= 0
}

/**
 * 디바운스 함수
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout

	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => func(...args), delay)
	}
}

/**
 * 쓰로틀 함수
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	func: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let lastCall = 0

	return (...args: Parameters<T>) => {
		const now = Date.now()
		if (now - lastCall >= delay) {
			lastCall = now
			func(...args)
		}
	}
}

/**
 * 로컬 스토리지 안전한 접근
 */
export const safeLocalStorage = {
	getItem: (key: string): string | null => {
		if (typeof window === 'undefined') return null
		try {
			return localStorage.getItem(key)
		} catch {
			return null
		}
	},
	setItem: (key: string, value: string): void => {
		if (typeof window === 'undefined') return
		try {
			localStorage.setItem(key, value)
		} catch {
			// 저장 실패 시 무시
		}
	},
	removeItem: (key: string): void => {
		if (typeof window === 'undefined') return
		try {
			localStorage.removeItem(key)
		} catch {
			// 삭제 실패 시 무시
		}
	},
}

/**
 * 환경 변수 안전한 접근
 */
export function getEnvVar(key: string, defaultValue?: string): string {
	return z
		.string({
			error: `Environment variable ${key} is not defined`,
		})
		.parse(
			process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || defaultValue,
		)
}

/**
 * 외부 링크 안전한 열기
 */
export function openExternalLink(url: string): void {
	if (typeof window === 'undefined') return

	const link = document.createElement('a')
	link.href = url
	link.target = '_blank'
	link.rel = 'noopener noreferrer'
	link.click()
}
