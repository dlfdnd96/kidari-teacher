module.exports = {
	apps: [
		{
			name: 'nextjs-app',
			script: 'npm',
			args: 'start',
			cwd: process.cwd(),
			instances: 'max',
			exec_mode: 'cluster',
			env: {
				NODE_ENV: 'production',
				PORT: 3000,
			},
			out_file: './logs/production-out.log',
			error_file: './logs/production-error.log',
			log_file: './logs/production-combined.log',
			time: true,
			watch: false,
			max_restarts: 10,
			min_uptime: '10s',
			max_memory_restart: '1G',
			kill_timeout: 5000,
			wait_ready: true,
			listen_timeout: 10000,
		},
	],
}
