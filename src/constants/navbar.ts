import {
	DefaultProfileImgProps,
	HomepageLogoImgProps,
	LoginLogoImgProps,
	LogoutLogoImgProps,
} from '@/types/navbar'

export const HOMEPAGE_LOGO_IMG: HomepageLogoImgProps = {
	src: '/images/navbar/homepage-logo.png',
	alt: '키다리선생님 홈페이지 로고 이미지',
}

export const DEFAULT_PROFILE_IMG: DefaultProfileImgProps = {
	src: '/images/navbar/default-profile.png',
	alt: '기본 프로필 이미지',
}

export const LOGIN_LOGO_IMG: LoginLogoImgProps = {
	src: '/images/navbar/login.png',
	alt: '로그인 이미지',
}

export const LOGOUT_LOGO_IMG: LogoutLogoImgProps = {
	src: '/images/navbar/logout.png',
	alt: '로그아웃 이미지',
}
