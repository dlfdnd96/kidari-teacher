'use client'

export default function GlobalError(_: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<html>
			<body>
				<h2>오류가 발생했습니다</h2>
			</body>
		</html>
	)
}
