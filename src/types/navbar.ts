import React from 'react'

export interface NavLink {
	href: string
	label: string
	isActive: boolean
	color: 'blue' | 'emerald'
	icon: React.ComponentType<any>
	requireAuth?: boolean
}
