import { memo } from 'react'
import Image from 'next/image'
import { GALLERY_PHOTOS } from '@/constants/homepage'
import { MessageCircle, Target } from 'lucide-react'

const GallerySection = memo(() => {
	const mainPhoto = GALLERY_PHOTOS.find((photo) => photo.isMain)
	const subPhotos = GALLERY_PHOTOS.filter((photo) => !photo.isMain)

	return (
		<section className="max-w-6xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
			<div className="text-center mb-6 sm:mb-8">
				<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					활동 사진
				</h2>
				<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
				<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
					실제 강연 현장에서 학생들과 소통하는 모습을 담았습니다
				</p>
			</div>

			{/* 메인 이미지 */}
			{mainPhoto && (
				<div className="mb-6 sm:mb-8">
					<div className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
						<div
							className={`${mainPhoto.aspectRatio} relative overflow-hidden`}
						>
							<Image
								width={1000}
								height={1000}
								src={mainPhoto.src}
								alt={mainPhoto.alt}
								className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							<div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<h3 className="text-lg sm:text-xl font-bold mb-1">
									{mainPhoto.title}
								</h3>
								<p className="text-sm sm:text-base opacity-90">
									{mainPhoto.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* 서브 이미지들 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
				{subPhotos.map((photo, index) => {
					const gradients = [
						'from-blue-400 to-purple-500',
						'from-green-400 to-blue-500',
					]
					const icons = [MessageCircle, Target]
					const IconComponent = icons[index]
					const highlights = ['활발한 소통', '경험 공유']
					const descriptions = [
						'학생들이 직접 질문하며 진로에 대한 궁금증을 해결하는 시간',
						'현장에서 쌓은 생생한 경험과 진로 선택의 노하우를 전달',
					]

					return (
						<div
							key={index}
							className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
						>
							<div className={`${photo.aspectRatio} relative overflow-hidden`}>
								<Image
									width={1000}
									height={1000}
									src={photo.src}
									alt={photo.alt}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<h4 className="font-bold text-sm sm:text-base mb-1">
										{photo.title}
									</h4>
									<p className="text-xs sm:text-sm opacity-90">
										{photo.description}
									</p>
								</div>
							</div>
							<div className="p-4 sm:p-6">
								<div className="flex items-center mb-2">
									<div
										className={`w-8 h-8 bg-gradient-to-r ${gradients[index]} rounded-full flex items-center justify-center mr-3`}
									>
										<IconComponent className="w-4 h-4 text-white" />
									</div>
									<span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
										{highlights[index]}
									</span>
								</div>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
									{descriptions[index]}
								</p>
							</div>
						</div>
					)
				})}
			</div>
		</section>
	)
})

GallerySection.displayName = 'GallerySection'

export default GallerySection
