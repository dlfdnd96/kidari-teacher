import Image from 'next/image'
import { Navbar } from '@/components/ui/linear/navbar'
import { BRAND_INFO, MENU_ITEMS } from '@/constants/landing'

export function TopNavbar() {
	return (
		<Navbar
			logo={
				<Image
					src={BRAND_INFO.LOGO_PATH}
					alt={BRAND_INFO.LOGO_ALT || '키다리 선생님 로고'}
					width={512}
					height={512}
					className="w-8 h-8"
					priority
					onError={(e) => {
						console.warn(`로고 이미지 로딩 실패: ${BRAND_INFO.LOGO_PATH}`)
						e.currentTarget.style.display = 'none'
					}}
				/>
			}
			logoText={BRAND_INFO.NAME || '키다리 선생님'}
			menuItems={MENU_ITEMS || []}
			sticky={true}
		/>
	)
}
