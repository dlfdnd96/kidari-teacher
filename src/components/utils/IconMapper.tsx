import React from 'react'
import {
	School,
	Users,
	BarChart3,
	Scale,
	DollarSign,
	Settings,
	Briefcase,
	Smile,
	Target,
	Star,
	MessageCircle,
	Calendar,
	Clock,
	User,
	Handshake,
	Mail,
	Monitor,
	TrendingUp,
	CheckCircle,
	Circle,
	AlertTriangle,
	AlertCircle,
	Info,
	RefreshCw,
	Plus,
	Save,
	X,
	PenLine,
	FileText,
	Trash,
	Rocket,
	Lock,
	SquarePen,
	type LucideIcon,
} from 'lucide-react'

// 아이콘 이름과 컴포넌트 매핑
const iconMap: Record<string, LucideIcon> = {
	School,
	Users,
	BarChart3,
	Scale,
	DollarSign,
	Settings,
	Briefcase,
	Smile,
	Target,
	Star,
	MessageCircle,
	Calendar,
	Clock,
	User,
	Handshake,
	Mail,
	Monitor,
	TrendingUp,
	CheckCircle,
	Circle,
	AlertTriangle,
	AlertCircle,
	Info,
	RefreshCw,
	Plus,
	Save,
	X,
	PenLine,
	FileText,
	Trash,
	Rocket,
	Lock,
	SquarePen,
}

interface IconProps {
	name: string
	className?: string
	size?: number
	color?: string
}

// 동적 아이콘 렌더링 컴포넌트
export const DynamicIcon: React.FC<IconProps> = ({
	name,
	className,
	size = 24,
	color = 'currentColor',
	...props
}) => {
	const IconComponent = iconMap[name]

	if (!IconComponent) {
		console.warn(`Icon "${name}" not found in iconMap`)
		// 기본 아이콘으로 fallback
		return <Star className={className} size={size} color={color} {...props} />
	}

	return (
		<IconComponent className={className} size={size} color={color} {...props} />
	)
}

// 아이콘 이름 확인 함수
export const getIconComponent = (name: string): LucideIcon | null => {
	return iconMap[name] || null
}

// 사용 가능한 모든 아이콘 이름 목록
export const availableIcons = Object.keys(iconMap)

export default DynamicIcon
