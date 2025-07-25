import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
		],
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	experimental: {
		optimizePackageImports: ['lucide-react'],
	},
}

export default nextConfig
