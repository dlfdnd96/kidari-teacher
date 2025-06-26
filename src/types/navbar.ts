import React from 'react'

export interface NavLink {
	href: string
	label: string
	icon: React.ComponentType<any>
	requireAuth?: boolean
}
