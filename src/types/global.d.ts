export declare global {
	interface Window {
		daum: {
			Postcode: new (options: {
				oncomplete: (data: {
					zonecode: string
					roadAddress: string
					jibunAddress: string
				}) => void
			}) => {
				open: () => void
			}
		}
	}
}
