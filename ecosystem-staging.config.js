module.exports = {
	apps: [
		{
			name: 'nextjs-app',
			script: 'node_modules/.bin/next',
			args: 'start',
			instances: 'max',
			exec_mode: 'cluster',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env_staging: {
				NODE_ENV: 'staging',
				PORT: 3000,
			},
		},
	],
}
