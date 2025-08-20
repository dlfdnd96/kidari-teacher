export const linearTheme = {
	colors: {
		primary: {
			default: '#E6E6E6',
			hover: '#FFFFFF',
			text: '#F7F8F8',
			link: '#FFFFFF',
		},
		background: {
			primary: '#08090A',
			secondary: '#0A0A0A',
			tertiary: 'rgba(10, 10, 10, 0.8)',
			overlay: 'rgba(0, 0, 0, 0.5)',
			header: 'rgba(10, 10, 10, 0.8)',
		},
		text: {
			primary: '#F7F8F8',
			secondary: 'rgba(255, 255, 255, 0.7)',
			tertiary: '#8A8F98',
			muted: '#D0D6E0',
			disabled: 'rgba(255, 255, 255, 0.3)',
		},
		border: {
			default: 'rgba(255, 255, 255, 0.08)',
			hover: 'rgba(255, 255, 255, 0.12)',
			focus: 'rgba(255, 255, 255, 0.16)',
		},
		semantic: {
			success: '#4CAF50',
			warning: '#FF9800',
			error: '#F44336',
			info: '#2196F3',
		},
	},
	typography: {
		fontFamily: {
			primary:
				'"Inter Variable", "SF Pro Display", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
			mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Menlo, Consolas, "Courier New", monospace',
		},
		fontSize: {
			xs: '12px',
			sm: '13px',
			base: '14px',
			md: '16px',
			lg: '21px',
			xl: '28px',
			'2xl': '36px',
			'3xl': '48px',
			'4xl': '56px',
		},
		fontWeight: {
			normal: '400',
			medium: '510',
			semibold: '538',
			bold: '600',
		},
		headings: {
			h1: {
				fontSize: '56px',
				fontWeight: '538',
				lineHeight: '1.1',
				letterSpacing: '-1.82px',
			},
			h2: {
				fontSize: '21px',
				fontWeight: '510',
				lineHeight: '1.33',
				letterSpacing: '-0.252px',
			},
			h3: {
				fontSize: '21px',
				fontWeight: '510',
				lineHeight: '1.33',
				letterSpacing: '-0.37px',
			},
			h4: {
				fontSize: '14px',
				fontWeight: '510',
				lineHeight: '1.71',
				letterSpacing: '-0.182px',
			},
		},
	},
	animation: {
		transition: {
			default: 'all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			colors:
				'color 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			transform: 'transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			opacity: 'opacity 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
		},
	},
} as const

export type LinearTheme = typeof linearTheme
