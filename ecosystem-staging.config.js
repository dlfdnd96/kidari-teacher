module.exports = {
	apps: [
		{
			name: 'nextjs-app',
			script: 'npm',
			args: 'start',
			cwd: process.cwd(),
			instances: '1',
			exec_mode: 'fork',
			env: {
				NODE_ENV: 'staging',
				PORT: 3000,
			},
			out_file: './logs/staging-out.log',
			error_file: './logs/staging-error.log',
			log_file: './logs/staging-combined.log',
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
