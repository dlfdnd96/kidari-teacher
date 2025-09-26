import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS 클래스를 안전하게 합치는 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
