export const calculateRank = <T extends { score: number }>(contents: T[]) => {
	let prevScore: number | null = null
	let prevRank = 0

	return contents.map((content, index) => {
		if (content.score === prevScore) {
			return { ...content, rank: prevRank }
		}

		const rank = index + 1
		prevScore = content.score
		prevRank = rank

		return { ...content, rank }
	})
}
