'use client'

import React, { useState } from 'react'
import { LinearButton } from '@/components/ui/linear/linear-button'
import {
	LinearCard,
	LinearCardContent,
	LinearCardDescription,
	LinearCardFooter,
	LinearCardHeader,
	LinearCardTitle,
} from '@/components/ui/linear/linear-card'
import {
	LinearInput,
	LinearLabel,
	LinearTextarea,
} from '@/components/ui/linear/linear-input'
import {
	LinearCode,
	LinearH1,
	LinearH2,
	LinearH3,
	LinearH4,
	LinearLink,
	LinearText,
	LinearTextMuted,
	LinearTextSecondary,
} from '@/components/ui/linear/linear-typography'
import {
	LinearContainer,
	LinearDivider,
	LinearNavigation,
	LinearNavigationActions,
	LinearNavigationBrand,
	LinearNavigationItem,
	LinearNavigationMenu,
} from '@/components/ui/linear/linear-navigation'
import { LinearCarousel } from '@/components/ui/linear/linear-carousel'
import {
	LinearHeroImageCard,
	LinearImageCard,
	LinearImageGallery,
} from '@/components/ui/linear/linear-image-card'
import { LinearNavbar } from '@/components/ui/linear/linear-navbar'
import { LinearSimpleFooter } from '@/components/ui/linear/linear-footer'
import {
	LinearFeatureHero,
	LinearHero,
} from '@/components/ui/linear/linear-hero'
import { LinearTestimonials } from '@/components/ui/linear/linear-testimonials'
import {
	LinearDialog,
	LinearDialogBody,
	LinearDialogCloseButton,
	LinearDialogContent,
	LinearDialogFooter,
	LinearDialogHeader,
	LinearDialogTitle,
	LinearModal,
	LinearModalBody,
	LinearModalCloseButton,
	LinearModalContent,
	LinearModalDescription,
	LinearModalFooter,
	LinearModalHeader,
	LinearModalTitle,
	LinearTag,
	LinearTagCloud,
	LinearTimeline,
} from '@/components/ui/linear'
import type { TestimonialItem } from '@/types/landing'
import type { LinearTimelineEntry } from '@/components/ui/linear/linear-timeline'

export default function ComponentsPage() {
	const [inputValue, setInputValue] = useState('')
	const [loading, setLoading] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isFormModalOpen, setIsFormModalOpen] = useState(false)
	const [isLargeModalOpen, setIsLargeModalOpen] = useState(false)

	const handleLoadingDemo = () => {
		setLoading(true)
		setTimeout(() => setLoading(false), 2000)
	}

	const sampleTestimonials: TestimonialItem[] = [
		{
			id: '1',
			quote:
				'Linear UI has transformed our development workflow. The components are beautifully designed and incredibly easy to use.',
		},
		{
			id: '2',
			quote:
				'The dark theme implementation is exceptional. Our users love the modern, sleek interface we built with Linear UI.',
		},
		{
			id: '3',
			quote:
				'TypeScript support is fantastic. The components are well-typed and provide excellent developer experience.',
		},
	]

	const timelineData: LinearTimelineEntry[] = [
		{
			title: '2024',
			content: (
				<div>
					<LinearText className="mb-4">
						🚀 Launched Linear UI component library with comprehensive dark
						theme support and TypeScript integration.
					</LinearText>
					<div className="space-y-2">
						<LinearText>✅ Built 50+ reusable components</LinearText>
						<LinearText>✅ Implemented glassmorphism design system</LinearText>
						<LinearText>✅ Added comprehensive documentation</LinearText>
						<LinearText>✅ TypeScript support with excellent DX</LinearText>
					</div>
				</div>
			),
		},
		{
			title: 'Q3 2024',
			content: (
				<div>
					<LinearText className="mb-4">
						📱 Enhanced mobile responsiveness and accessibility features across
						all components.
					</LinearText>
					<div className="space-y-2">
						<LinearText>✅ Mobile-first responsive design</LinearText>
						<LinearText>✅ WCAG 2.1 accessibility compliance</LinearText>
						<LinearText>✅ Improved touch interactions</LinearText>
					</div>
				</div>
			),
		},
		{
			title: 'Q4 2024',
			content: (
				<div>
					<LinearText className="mb-4">
						🔧 Currently working on advanced components and animations.
					</LinearText>
					<div className="space-y-2">
						<LinearText>
							🔄 Timeline components with scroll animations
						</LinearText>
						<LinearText>🔄 Advanced form builders</LinearText>
						<LinearText>🔄 Data visualization components</LinearText>
					</div>
				</div>
			),
		},
		{
			title: '2025',
			content: (
				<div>
					<LinearText className="mb-4">
						🎯 Planned features and improvements for the next major release.
					</LinearText>
					<div className="space-y-2">
						<LinearText>⏳ Plugin ecosystem</LinearText>
						<LinearText>⏳ Visual component builder</LinearText>
						<LinearText>⏳ Advanced theming system</LinearText>
					</div>
				</div>
			),
		},
	]

	return (
		<div className="min-h-screen bg-[#08090A]">
			{/* Navigation Demo */}
			<LinearNavigation>
				<LinearNavigationBrand>
					<LinearH4>Linear UI</LinearH4>
				</LinearNavigationBrand>
				<LinearNavigationMenu>
					<LinearNavigationItem>Home</LinearNavigationItem>
					<LinearNavigationItem>About</LinearNavigationItem>
					<LinearNavigationItem>Contact</LinearNavigationItem>
				</LinearNavigationMenu>
				<LinearNavigationActions>
					<LinearButton variant="secondary" size="sm">
						Login
					</LinearButton>
					<LinearButton variant="primary" size="sm">
						Sign Up
					</LinearButton>
				</LinearNavigationActions>
			</LinearNavigation>

			{/* Main Content */}
			<LinearContainer className="pt-24 pb-12">
				<div className="space-y-12">
					{/* Header Section */}
					<div className="text-center space-y-4">
						<LinearH1>Linear Dark Theme Components</LinearH1>
						<LinearText className="text-lg max-w-2xl mx-auto">
							A collection of reusable React components built with the Linear
							Dark Theme design system. These components follow consistent
							styling patterns and are optimized for dark interfaces.
						</LinearText>
					</div>

					<LinearDivider />

					{/* Typography Section */}
					<div className="space-y-8">
						<LinearH2>Typography</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>Text Styles</LinearCardTitle>
								<LinearCardDescription>
									Various text components with consistent styling and hierarchy
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-4">
								<div className="space-y-2">
									<LinearH1>Heading 1 - Main Title</LinearH1>
									<LinearH2>Heading 2 - Section Title</LinearH2>
									<LinearH3>Heading 3 - Subsection</LinearH3>
									<LinearH4>Heading 4 - Component Title</LinearH4>
								</div>
								<div className="space-y-2">
									<LinearText>
										Primary text - This is the main body text used throughout
										the application.
									</LinearText>
									<LinearTextSecondary>
										Secondary text - Used for supporting information and
										descriptions.
									</LinearTextSecondary>
									<LinearTextMuted>
										Muted text - Used for less important information and
										metadata.
									</LinearTextMuted>
								</div>
								<div className="space-y-2">
									<LinearText>
										Inline code example:{' '}
										<LinearCode>const theme = linearTheme</LinearCode>
									</LinearText>
									<LinearText>
										Link example:{' '}
										<LinearLink href="#">Visit our documentation</LinearLink>
									</LinearText>
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>

					{/* Buttons Section */}
					<div className="space-y-8">
						<LinearH2>Buttons</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>Button Variants</LinearCardTitle>
								<LinearCardDescription>
									Different button styles for various use cases and interactions
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-6">
								<div className="space-y-3">
									<LinearH4>Primary Variants</LinearH4>
									<div className="flex flex-wrap gap-3">
										<LinearButton variant="primary">Primary</LinearButton>
										<LinearButton variant="secondary">Secondary</LinearButton>
										<LinearButton variant="ghost">Ghost</LinearButton>
									</div>
								</div>

								<div className="space-y-3">
									<LinearH4>Semantic Variants</LinearH4>
									<div className="flex flex-wrap gap-3">
										<LinearButton variant="success">Success</LinearButton>
										<LinearButton variant="warning">Warning</LinearButton>
										<LinearButton variant="error">Error</LinearButton>
										<LinearButton variant="info">Info</LinearButton>
									</div>
								</div>

								<div className="space-y-3">
									<LinearH4>Sizes</LinearH4>
									<div className="flex items-center flex-wrap gap-3">
										<LinearButton variant="primary" size="sm">
											Small
										</LinearButton>
										<LinearButton variant="primary" size="default">
											Default
										</LinearButton>
										<LinearButton variant="primary" size="lg">
											Large
										</LinearButton>
										<LinearButton variant="primary" size="icon">
											✦
										</LinearButton>
									</div>
								</div>

								<div className="space-y-3">
									<LinearH4>States</LinearH4>
									<div className="flex flex-wrap gap-3">
										<LinearButton variant="primary" disabled>
											Disabled
										</LinearButton>
										<LinearButton
											variant="primary"
											loading={loading}
											onClick={handleLoadingDemo}
										>
											{loading ? 'Loading...' : 'Click for Loading'}
										</LinearButton>
									</div>
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>

					{/* Form Inputs Section */}
					<div className="space-y-8">
						<LinearH2>Form Controls</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>Input Components</LinearCardTitle>
								<LinearCardDescription>
									Form controls with consistent styling and focus states
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<LinearLabel htmlFor="email">Email Address</LinearLabel>
										<LinearInput
											id="email"
											type="email"
											placeholder="Enter your email"
											value={inputValue}
											onChange={(e) => setInputValue(e.target.value)}
										/>
									</div>

									<div className="space-y-2">
										<LinearLabel htmlFor="password">Password</LinearLabel>
										<LinearInput
											id="password"
											type="password"
											placeholder="Enter your password"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<LinearLabel htmlFor="error-input">
										Input with Error
									</LinearLabel>
									<LinearInput
										id="error-input"
										placeholder="This input has an error state"
										error={true}
									/>
									<LinearTextMuted>This field is required</LinearTextMuted>
								</div>

								<div className="space-y-2">
									<LinearLabel htmlFor="message">Message</LinearLabel>
									<LinearTextarea
										id="message"
										placeholder="Enter your message here..."
										rows={4}
									/>
								</div>

								<div className="space-y-2">
									<LinearLabel htmlFor="disabled-input">
										Disabled Input
									</LinearLabel>
									<LinearInput
										id="disabled-input"
										placeholder="This input is disabled"
										disabled
									/>
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>

					{/* Cards Section */}
					<div className="space-y-8">
						<LinearH2>Cards</LinearH2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<LinearCard>
								<LinearCardHeader>
									<LinearCardTitle>Basic Card</LinearCardTitle>
									<LinearCardDescription>
										A simple card with hover effects and glassmorphism styling
									</LinearCardDescription>
								</LinearCardHeader>
								<LinearCardContent>
									<LinearText>
										This is a basic card component that follows the Linear dark
										theme design system.
									</LinearText>
								</LinearCardContent>
							</LinearCard>

							<LinearCard>
								<LinearCardHeader>
									<LinearCardTitle>Interactive Card</LinearCardTitle>
									<LinearCardDescription>
										Card with button interactions
									</LinearCardDescription>
								</LinearCardHeader>
								<LinearCardContent>
									<LinearText className="mb-4">
										Cards can contain any content including buttons and form
										controls.
									</LinearText>
								</LinearCardContent>
								<LinearCardFooter>
									<LinearButton variant="primary" size="sm">
										Action
									</LinearButton>
									<LinearButton variant="secondary" size="sm">
										Cancel
									</LinearButton>
								</LinearCardFooter>
							</LinearCard>

							<LinearCard>
								<LinearCardHeader>
									<LinearCardTitle>Feature Card</LinearCardTitle>
									<LinearCardDescription>
										Showcase component features
									</LinearCardDescription>
								</LinearCardHeader>
								<LinearCardContent>
									<div className="space-y-2">
										<LinearText>✓ Consistent theming</LinearText>
										<LinearText>✓ Hover animations</LinearText>
										<LinearText>✓ Accessible design</LinearText>
										<LinearText>✓ TypeScript support</LinearText>
									</div>
								</LinearCardContent>
							</LinearCard>
						</div>
					</div>

					{/* Image Cards Section */}
					<div className="space-y-8">
						<LinearH2>Image Cards</LinearH2>
						<div className="space-y-8">
							{/* Basic Image Cards */}
							<div className="space-y-4">
								<LinearH3>Basic Image Cards</LinearH3>
								<LinearImageGallery columns={3}>
									<LinearImageCard
										src="/images/lecture_001.png"
										alt="Modern workspace"
										title="Modern Workspace"
										description="A clean and organized workspace setup for maximum productivity"
										footer={
											<div className="flex gap-2">
												<LinearButton variant="primary" size="sm">
													View
												</LinearButton>
												<LinearButton variant="secondary" size="sm">
													Share
												</LinearButton>
											</div>
										}
									/>

									<LinearImageCard
										src="/images/lecture_002.png"
										alt="Creative design"
										title="Creative Design"
										description="Innovative design solutions for modern digital experiences"
										aspectRatio="square"
									/>

									<LinearImageCard
										src="/images/lecture_003.png"
										alt="Data visualization"
										title="Data Analytics"
										description="Advanced analytics and data visualization tools for business insights"
										footer={
											<LinearButton variant="info" size="sm">
												Learn More
											</LinearButton>
										}
									/>
								</LinearImageGallery>
							</div>

							{/* Overlay Image Cards */}
							<div className="space-y-4">
								<LinearH3>Overlay Style Cards</LinearH3>
								<LinearImageGallery columns={2}>
									<LinearImageCard
										src="/images/lecture_001.png"
										alt="Team collaboration"
										title="Team Collaboration"
										description="Building stronger teams through effective communication and shared goals"
										overlay={true}
										aspectRatio="video"
									/>

									<LinearImageCard
										src="/images/lecture_002.png"
										alt="Innovation lab"
										title="Innovation Lab"
										description="Experimenting with cutting-edge technologies and creative solutions"
										overlay={true}
										aspectRatio="video"
									/>
								</LinearImageGallery>
							</div>

							{/* Hero Image Card */}
							<div className="space-y-4">
								<LinearH3>Hero Image Card</LinearH3>
								<LinearHeroImageCard
									src="/images/lecture_001.png"
									alt="Digital transformation"
									title="Digital Transformation"
									description="Embracing technology to drive innovation and growth in the digital age. Transform your business with modern solutions and streamlined processes."
									height="h-80"
								/>
							</div>
						</div>
					</div>

					{/* Carousel Section */}
					<div className="space-y-8">
						<LinearH2>Carousel</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>Interactive Carousel</LinearCardTitle>
								<LinearCardDescription>
									Showcase multiple items with smooth transitions, auto-play,
									and navigation controls
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-8">
								{/* Basic Carousel */}
								<div className="space-y-4">
									<LinearH4>Basic Carousel (Auto-play)</LinearH4>
									<LinearCarousel
										className="group"
										autoPlay={true}
										autoPlayDelay={4000}
										items={[
											<LinearImageCard
												key="carousel-1"
												src="/images/lecture_001.png"
												alt="Technology landscape"
												title="Future of Technology"
												description="Exploring emerging technologies and their impact on society"
												overlay={true}
												aspectRatio="video"
											/>,
											<LinearImageCard
												key="carousel-2"
												src="/images/lecture_002.png"
												alt="Digital innovation"
												title="Digital Innovation"
												description="Revolutionary approaches to solving complex problems"
												overlay={true}
												aspectRatio="video"
											/>,
											<LinearImageCard
												key="carousel-3"
												src="/images/lecture_003.png"
												alt="Startup culture"
												title="Startup Ecosystem"
												description="Building the next generation of innovative companies"
												overlay={true}
												aspectRatio="video"
											/>,
										]}
									/>
								</div>

								{/* Multi-item Carousel */}
								<div className="space-y-4">
									<LinearH4>Multi-item Carousel</LinearH4>
									<LinearCarousel
										className="group"
										itemsPerView={3}
										gap={16}
										items={Array.from({ length: 6 }, (_, i) => (
											<LinearCard key={`multi-${i}`}>
												<LinearCardHeader>
													<LinearCardTitle>Feature {i + 1}</LinearCardTitle>
													<LinearCardDescription>
														Description for feature {i + 1}
													</LinearCardDescription>
												</LinearCardHeader>
												<LinearCardContent>
													<LinearText>
														This is a sample feature card in the multi-item
														carousel.
													</LinearText>
												</LinearCardContent>
												<LinearCardFooter>
													<LinearButton variant="secondary" size="sm">
														Learn More
													</LinearButton>
												</LinearCardFooter>
											</LinearCard>
										))}
									/>
								</div>

								{/* Content Carousel */}
								<div className="space-y-4">
									<LinearH4>Content Carousel</LinearH4>
									<LinearCarousel
										autoPlay={false}
										items={[
											<LinearCard
												key="content-1"
												className="h-64 flex items-center justify-center"
											>
												<div className="text-center space-y-4">
													<LinearH3>Welcome to Linear UI</LinearH3>
													<LinearText>
														A comprehensive design system for modern
														applications
													</LinearText>
													<LinearButton variant="primary">
														Get Started
													</LinearButton>
												</div>
											</LinearCard>,
											<LinearCard
												key="content-2"
												className="h-64 flex items-center justify-center"
											>
												<div className="text-center space-y-4">
													<LinearH3>Built for Developers</LinearH3>
													<LinearText>
														TypeScript-first components with excellent DX
													</LinearText>
													<LinearButton variant="success">
														View Docs
													</LinearButton>
												</div>
											</LinearCard>,
											<LinearCard
												key="content-3"
												className="h-64 flex items-center justify-center"
											>
												<div className="text-center space-y-4">
													<LinearH3>Dark Theme Ready</LinearH3>
													<LinearText>
														Optimized for dark interfaces with beautiful
														glassmorphism
													</LinearText>
													<LinearButton variant="info">Explore</LinearButton>
												</div>
											</LinearCard>,
										]}
									/>
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>

					{/* Layout Components Section */}
					<div className="space-y-8">
						<LinearH2>Layout Components</LinearH2>

						{/* Navbar Demo */}
						<div className="space-y-4">
							<LinearH3>Navbar</LinearH3>
							<LinearCard>
								<LinearCardHeader>
									<LinearCardTitle>Navigation Components</LinearCardTitle>
									<LinearCardDescription>
										Responsive navigation bars with mobile menu support
									</LinearCardDescription>
								</LinearCardHeader>
								<LinearCardContent className="space-y-6">
									{/* Basic Navbar */}
									<div className="space-y-3">
										<LinearH4>Basic Navbar</LinearH4>
										<div className="border border-white/8 rounded-lg overflow-hidden">
											<LinearNavbar
												logoText="My App"
												menuItems={[
													{
														id: 'activity',
														label: 'Activity',
														href: '#',
														active: true,
													},
													{ id: 'about', label: 'About', href: '#' },
													{ id: 'service', label: 'Services', href: '#' },
													{ id: 'contact', label: 'Contact', href: '#' },
												]}
												sticky={false}
											/>
										</div>
									</div>

									{/* Transparent Navbar */}
									<div className="space-y-3">
										<LinearH4>Transparent Navbar</LinearH4>
										<div className="relative border border-white/8 rounded-lg overflow-hidden">
											<div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
											<LinearNavbar
												logoText="Transparent"
												menuItems={[
													{
														id: 'activity',
														label: 'Activity',
														href: '#',
														active: true,
													},
													{ id: 'feature', label: 'Features', href: '#' },
													{ id: 'price', label: 'Pricing', href: '#' },
												]}
												sticky={false}
												transparent={true}
												className="absolute top-0 left-0 right-0"
											/>
										</div>
									</div>
								</LinearCardContent>
							</LinearCard>
						</div>

						{/* Hero Demo */}
						<div className="space-y-4">
							<LinearH3>Hero Sections</LinearH3>
							<LinearCard>
								<LinearCardHeader>
									<LinearCardTitle>Hero Components</LinearCardTitle>
									<LinearCardDescription>
										Eye-catching hero sections with various layouts and styles
									</LinearCardDescription>
								</LinearCardHeader>
								<LinearCardContent className="space-y-8">
									{/* Basic Hero */}
									<div className="space-y-3">
										<LinearH4>Basic Hero</LinearH4>
										<div className="border border-white/8 rounded-lg overflow-hidden">
											<LinearHero
												title="Build Something Amazing"
												description="Create beautiful, responsive applications with our comprehensive component library and design system."
												primaryAction={{
													label: 'Get Started',
													onClick: () => console.log('Get started clicked'),
												}}
												secondaryAction={{
													label: 'Learn More',
													onClick: () => console.log('Learn more clicked'),
												}}
												height="md"
											/>
										</div>
									</div>

									{/* Hero with Background */}
									<div className="space-y-3">
										<LinearH4>Hero with Background Image</LinearH4>
										<div className="border border-white/8 rounded-lg overflow-hidden">
											<LinearHero
												title="Next Generation Platform"
												subtitle="🚀 Now in Beta"
												description="Experience the future of development with our cutting-edge tools and seamless workflow."
												backgroundImage="/images/lecture_001.png"
												primaryAction={{
													label: 'Join Beta',
													onClick: () => console.log('Join beta clicked'),
												}}
												height="md"
											/>
										</div>
									</div>

									{/* Animated Hero */}
									<div className="space-y-3">
										<LinearH4>Animated Hero with Geometric Shapes</LinearH4>
										<div className="border border-white/8 rounded-lg overflow-hidden">
											<LinearHero
												animated={true}
												title="Elevate Your Digital Vision"
												subtitle="Design Collective"
												description="Crafting exceptional digital experiences through innovative design and cutting-edge technology."
												primaryAction={{
													label: 'Get Started',
													onClick: () => console.log('Get started clicked'),
												}}
												secondaryAction={{
													label: 'Learn More',
													onClick: () => console.log('Learn more clicked'),
												}}
												height="full"
											/>
										</div>
									</div>

									{/* Feature Hero */}
									<div className="space-y-3">
										<LinearH4>Feature Hero</LinearH4>
										<div className="border border-white/8 rounded-lg overflow-hidden bg-[#08090A]">
											<LinearFeatureHero
												title="Why Choose Linear UI?"
												description="Built with modern technologies and best practices for exceptional user experience."
												features={[
													{
														icon: (
															<div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
																<svg
																	className="w-6 h-6 text-blue-400"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path
																		fillRule="evenodd"
																		d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
																		clipRule="evenodd"
																	/>
																</svg>
															</div>
														),
														title: 'Component Library',
														description:
															'Extensive collection of reusable components',
													},
													{
														icon: (
															<div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
																<svg
																	className="w-6 h-6 text-green-400"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																		clipRule="evenodd"
																	/>
																</svg>
															</div>
														),
														title: 'TypeScript Ready',
														description:
															'Full TypeScript support with excellent DX',
													},
													{
														icon: (
															<div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
																<svg
																	className="w-6 h-6 text-purple-400"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path
																		fillRule="evenodd"
																		d="M4 2a2 2 0 00-2 2v8a2 2 0 002 2V4h8a2 2 0 00-2-2H4z"
																		clipRule="evenodd"
																	/>
																	<path
																		fillRule="evenodd"
																		d="M8 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2z"
																		clipRule="evenodd"
																	/>
																</svg>
															</div>
														),
														title: 'Dark Theme',
														description:
															'Beautiful dark theme with glassmorphism effects',
													},
												]}
											/>
										</div>
									</div>
								</LinearCardContent>
							</LinearCard>
						</div>

						{/* Footer Demo */}
						<div className="space-y-4">
							<LinearH3>Footer</LinearH3>
							<LinearCard>
								<LinearCardHeader>
									<LinearCardTitle>Footer Components</LinearCardTitle>
									<LinearCardDescription>
										Professional footer layouts with links, social media, and
										branding
									</LinearCardDescription>
								</LinearCardHeader>
								<LinearCardContent className="space-y-8">
									{/* Simple Footer */}
									<div className="space-y-3">
										<LinearH4>Simple Footer</LinearH4>
										<div className="border border-white/8 rounded-lg overflow-hidden">
											<LinearSimpleFooter text="© 2024 Your Company. All rights reserved." />
										</div>
									</div>
								</LinearCardContent>
							</LinearCard>
						</div>
					</div>

					{/* Testimonials Section */}
					<div className="space-y-8">
						<LinearH2>Testimonials</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>User Feedback</LinearCardTitle>
								<LinearCardDescription>
									Showcase customer testimonials and reviews with various
									layouts and styles
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-8">
								{/* Default Grid Layout */}
								<div className="space-y-4">
									<LinearH4>Default Grid Layout</LinearH4>
									<LinearTestimonials
										testimonials={sampleTestimonials}
										columns={3}
										variant="default"
									/>
								</div>

								{/* Two Column Layout */}
								<div className="space-y-4">
									<LinearH4>Two Column Layout</LinearH4>
									<LinearTestimonials
										testimonials={sampleTestimonials.slice(0, 2)}
										columns={2}
										variant="default"
									/>
								</div>

								{/* Minimal Layout */}
								<div className="space-y-4">
									<LinearH4>Minimal Layout</LinearH4>
									<LinearTestimonials
										testimonials={[sampleTestimonials[0]]}
										variant="minimal"
									/>
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>

					{/* Tag Cloud Section */}
					<div className="space-y-8">
						<LinearH2>Tag Cloud</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>Tag Components</LinearCardTitle>
								<LinearCardDescription>
									Interactive tags and tag clouds for categorization and
									filtering
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-6">
								{/* Individual Tags */}
								<div className="space-y-3">
									<LinearH4>Individual Tags</LinearH4>
									<div className="flex flex-wrap gap-2">
										<LinearTag label="React" count={42} />
										<LinearTag
											label="TypeScript"
											count={28}
											variant="primary"
										/>
										<LinearTag
											label="JavaScript"
											count={15}
											variant="secondary"
										/>
										<LinearTag label="CSS" count={12} variant="accent" />
										<LinearTag label="HTML" size="sm" />
										<LinearTag label="Node.js" size="lg" variant="primary" />
									</div>
								</div>

								{/* Tag Cloud - Skills */}
								<div className="space-y-3">
									<LinearH4>Skills Tag Cloud</LinearH4>
									<LinearTagCloud
										tags={[
											{
												id: '1',
												label: 'React',
												count: 42,
												variant: 'primary',
											},
											{
												id: '2',
												label: 'TypeScript',
												count: 28,
												variant: 'secondary',
											},
											{
												id: '3',
												label: 'JavaScript',
												count: 35,
												variant: 'default',
											},
											{
												id: '4',
												label: 'Next.js',
												count: 22,
												variant: 'accent',
											},
											{
												id: '5',
												label: 'Node.js',
												count: 18,
												variant: 'primary',
												size: 'sm',
											},
											{
												id: '6',
												label: 'CSS',
												count: 15,
												variant: 'default',
												size: 'sm',
											},
											{ id: '7', label: 'HTML', count: 12, size: 'sm' },
											{
												id: '8',
												label: 'TailwindCSS',
												count: 25,
												variant: 'accent',
												size: 'sm',
											},
											{
												id: '9',
												label: 'GraphQL',
												count: 8,
												variant: 'secondary',
												size: 'sm',
											},
											{ id: '10', label: 'Docker', count: 6, size: 'sm' },
										]}
										spacing="normal"
										onTagClick={(tag) => console.log('Clicked tag:', tag)}
									/>
								</div>

								{/* Tag Cloud - Categories */}
								<div className="space-y-3">
									<LinearH4>Category Tags</LinearH4>
									<LinearTagCloud
										tags={[
											{
												id: '1',
												label: 'Frontend',
												variant: 'primary',
												size: 'lg',
											},
											{
												id: '2',
												label: 'Backend',
												variant: 'secondary',
												size: 'lg',
											},
											{
												id: '3',
												label: 'DevOps',
												variant: 'accent',
												size: 'default',
											},
											{
												id: '4',
												label: 'Design',
												variant: 'default',
												size: 'default',
											},
											{
												id: '5',
												label: 'Mobile',
												variant: 'primary',
												size: 'sm',
											},
											{
												id: '6',
												label: 'Testing',
												variant: 'secondary',
												size: 'sm',
											},
										]}
										spacing="loose"
									/>
								</div>

								{/* Compact Tag Cloud */}
								<div className="space-y-3">
									<LinearH4>Compact Tag Cloud</LinearH4>
									<LinearTagCloud
										tags={[
											{ id: '1', label: 'Web Dev', size: 'sm' },
											{
												id: '2',
												label: 'UI/UX',
												size: 'sm',
												variant: 'primary',
											},
											{
												id: '3',
												label: 'API',
												size: 'sm',
												variant: 'secondary',
											},
											{
												id: '4',
												label: 'Database',
												size: 'sm',
												variant: 'accent',
											},
											{ id: '5', label: 'Cloud', size: 'sm' },
											{
												id: '6',
												label: 'Security',
												size: 'sm',
												variant: 'primary',
											},
											{
												id: '7',
												label: 'Performance',
												size: 'sm',
												variant: 'secondary',
											},
											{ id: '8', label: 'SEO', size: 'sm' },
											{
												id: '9',
												label: 'Analytics',
												size: 'sm',
												variant: 'accent',
											},
											{ id: '10', label: 'Deployment', size: 'sm' },
										]}
										spacing="tight"
										onTagClick={(tag) => console.log('Category selected:', tag)}
									/>
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>

					{/* Timeline Section */}
					<div className="space-y-8">
						<LinearH2>Timeline</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>Timeline Components</LinearCardTitle>
								<LinearCardDescription>
									Display chronological events and progress with continuous
									timeline visualization and status indicators
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-8">
								{/* Project Development Timeline */}
								<div className="space-y-4">
									<LinearH4>Project Development Timeline</LinearH4>
									<LinearTimeline
										data={[
											{
												title: '2024',
												content: (
													<div>
														<LinearText className="mb-8">
															🚀 Launched Linear UI component library with
															comprehensive dark theme support and TypeScript
															integration.
														</LinearText>
														<div className="grid grid-cols-2 gap-4">
															<LinearImageCard
																src="/images/lecture_001.png"
																alt="startup template"
																title="Component Library"
																description="Built 50+ reusable components"
																aspectRatio="video"
																overlay={true}
															/>
															<LinearImageCard
																src="/images/lecture_002.png"
																alt="design system"
																title="Design System"
																description="Glassmorphism design implementation"
																aspectRatio="video"
																overlay={true}
															/>
															<LinearImageCard
																src="/images/lecture_003.png"
																alt="documentation"
																title="Documentation"
																description="Comprehensive TypeScript docs"
																aspectRatio="video"
																overlay={true}
															/>
															<LinearImageCard
																src="/images/lecture_001.png"
																alt="typescript support"
																title="TypeScript DX"
																description="Excellent developer experience"
																aspectRatio="video"
																overlay={true}
															/>
														</div>
													</div>
												),
											},
											{
												title: 'Q3 2024',
												content: (
													<div>
														<LinearText className="mb-8">
															📱 Enhanced mobile responsiveness and
															accessibility features across all components with
															modern web standards.
														</LinearText>
														<div className="grid grid-cols-2 gap-4">
															<LinearImageCard
																src="/images/lecture_001.png"
																alt="mobile first"
																title="Mobile-First Design"
																description="Responsive across all devices"
																aspectRatio="video"
																overlay={true}
															/>
															<LinearImageCard
																src="/images/lecture_002.png"
																alt="accessibility"
																title="WCAG 2.1 Compliance"
																description="Fully accessible components"
																aspectRatio="video"
																overlay={true}
															/>
															<LinearImageCard
																src="/images/lecture_003.png"
																alt="touch interactions"
																title="Touch Interactions"
																description="Optimized for mobile usage"
																aspectRatio="video"
																overlay={true}
															/>
															<LinearImageCard
																src="/images/lecture_001.png"
																alt="performance"
																title="Performance"
																description="Optimized loading and rendering"
																aspectRatio="video"
																overlay={true}
															/>
														</div>
													</div>
												),
											},
											{
												title: 'Current Progress',
												content: (
													<div>
														<LinearText className="mb-4">
															🔧 Currently working on advanced components and
															animations.
														</LinearText>
														<div className="mb-8 space-y-2">
															<LinearText>
																🔄 Timeline components with scroll animations
															</LinearText>
															<LinearText>
																🔄 Advanced form builders with validation
															</LinearText>
															<LinearText>
																🔄 Data visualization components
															</LinearText>
															<LinearText>
																⏳ Plugin ecosystem development
															</LinearText>
															<LinearText>
																⏳ Visual component builder tool
															</LinearText>
														</div>
														<div className="grid grid-cols-2 gap-4">
															<LinearImageCard
																src="/images/lecture_001.png"
																alt="timeline components"
																title="Timeline Components"
																description="Interactive scroll-based timelines"
																aspectRatio="video"
																overlay={true}
															/>
															<LinearImageCard
																src="/images/lecture_002.png"
																alt="form builders"
																title="Form Builders"
																description="Advanced form validation system"
																aspectRatio="video"
																overlay={true}
															/>
															<LinearImageCard
																src="/images/lecture_003.png"
																alt="data visualization"
																title="Data Visualization"
																description="Charts and graph components"
																aspectRatio="video"
																overlay={true}
															/>
															<LinearImageCard
																src="/images/lecture_001.png"
																alt="animation system"
																title="Animation System"
																description="Framer Motion integration"
																aspectRatio="video"
																overlay={true}
															/>
														</div>
													</div>
												),
											},
										]}
									/>
								</div>

								{/* Product Roadmap Timeline */}
								<div className="space-y-4">
									<LinearH4>Product Roadmap</LinearH4>
									<LinearTimeline
										data={[
											{
												title: 'Q1 2024 - Foundation',
												content: (
													<div>
														<LinearText className="mb-3">
															✅ Established core infrastructure and
															foundational components.
														</LinearText>
														<div className="space-y-1">
															<LinearText>
																• Component library architecture
															</LinearText>
															<LinearText>• TypeScript integration</LinearText>
															<LinearText>
																• Design system foundations
															</LinearText>
														</div>
													</div>
												),
											},
											{
												title: 'Q2 2024 - Core Features',
												content: (
													<div>
														<LinearText className="mb-3">
															✅ Implemented essential UI components and
															interactions.
														</LinearText>
														<div className="space-y-1">
															<LinearText>• Navigation components</LinearText>
															<LinearText>
																• Form controls and validation
															</LinearText>
															<LinearText>
																• Modal and dialog systems
															</LinearText>
														</div>
													</div>
												),
											},
											{
												title: 'Q3 2024 - Advanced Components',
												content: (
													<div>
														<LinearText className="mb-3">
															🔄 Currently developing advanced components and
															features.
														</LinearText>
														<div className="space-y-1">
															<LinearText>🔄 Timeline components</LinearText>
															<LinearText>🔄 Data visualization</LinearText>
															<LinearText>🔄 Animation system</LinearText>
														</div>
													</div>
												),
											},
											{
												title: 'Q4 2024 - Polish & Launch',
												content: (
													<div>
														<LinearText className="mb-3">
															Final optimizations and public release
															preparation.
														</LinearText>
														<div className="space-y-1">
															<LinearText>
																⏳ Performance optimizations
															</LinearText>
															<LinearText>
																⏳ Accessibility improvements
															</LinearText>
															<LinearText>
																⏳ Documentation completion
															</LinearText>
														</div>
													</div>
												),
											},
										]}
									/>
								</div>

								{/* Daily Schedule Timeline */}
								<div className="space-y-4">
									<LinearH4>Daily Schedule</LinearH4>
									<LinearTimeline
										data={[
											{
												title: '9:00 AM - Team Standup',
												content: (
													<LinearText>
														✅ Daily team sync completed - discussed blockers
														and priorities for the day.
													</LinearText>
												),
											},
											{
												title: '10:30 AM - Development Work',
												content: (
													<LinearText>
														✅ Implemented timeline component features and
														resolved styling issues.
													</LinearText>
												),
											},
											{
												title: '2:00 PM - Code Review',
												content: (
													<LinearText>
														🔄 Currently reviewing pull requests and providing
														feedback to team members.
													</LinearText>
												),
											},
											{
												title: '3:30 PM - Client Meeting',
												content: (
													<LinearText>
														⏳ Upcoming client demo and feedback session on
														latest features.
													</LinearText>
												),
											},
											{
												title: '5:00 PM - Planning Session',
												content: (
													<LinearText>
														⏳ Sprint planning for next iteration and task
														prioritization.
													</LinearText>
												),
											},
										]}
									/>
								</div>

								{/* Error Recovery Timeline */}
								<div className="space-y-4">
									<LinearH4>Issue Resolution Timeline</LinearH4>
									<LinearTimeline
										data={[
											{
												title: 'Issue Identification',
												content: (
													<LinearText>
														✅ Critical bug identified in production affecting
														user authentication flow.
													</LinearText>
												),
											},
											{
												title: 'Initial Fix Attempt',
												content: (
													<LinearText>
														❌ First hotfix deployment failed validation tests
														and was rolled back.
													</LinearText>
												),
											},
											{
												title: 'Root Cause Analysis',
												content: (
													<LinearText>
														✅ Identified underlying database connection pool
														issue causing intermittent failures.
													</LinearText>
												),
											},
											{
												title: 'Comprehensive Fix',
												content: (
													<LinearText>
														✅ Implemented proper connection management and
														deployed successful fix.
													</LinearText>
												),
											},
											{
												title: 'Monitoring & Verification',
												content: (
													<LinearText>
														🔄 Actively monitoring system performance and user
														feedback post-fix.
													</LinearText>
												),
											},
										]}
									/>
								</div>

								{/* Company Timeline Demo */}
								<div className="space-y-4">
									<LinearH4>Linear UI Development Timeline</LinearH4>
									<LinearTimeline data={timelineData} />
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>

					{/* Dialogs Section */}
					<div className="space-y-8">
						<LinearH2>Dialogs</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>Dialog Components</LinearCardTitle>
								<LinearCardDescription>
									Simple dialog components for notifications and confirmations
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-6">
								{/* Basic Dialog */}
								<div className="space-y-3">
									<LinearH4>Basic Dialog</LinearH4>
									<div className="flex gap-3">
										<LinearButton
											variant="primary"
											onClick={() => setIsDialogOpen(true)}
										>
											Open Basic Dialog
										</LinearButton>
										<LinearButton
											variant="warning"
											onClick={() => setIsConfirmDialogOpen(true)}
										>
											Open Confirmation Dialog
										</LinearButton>
									</div>
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>

					{/* Modals Section */}
					<div className="space-y-8">
						<LinearH2>Modals</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>Modal Components</LinearCardTitle>
								<LinearCardDescription>
									Advanced modal components with enhanced features and
									animations
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-6">
								{/* Modal Examples */}
								<div className="space-y-3">
									<LinearH4>Modal Variants</LinearH4>
									<div className="flex flex-wrap gap-3">
										<LinearButton
											variant="primary"
											onClick={() => setIsModalOpen(true)}
										>
											Basic Modal
										</LinearButton>
										<LinearButton
											variant="info"
											onClick={() => setIsFormModalOpen(true)}
										>
											Form Modal
										</LinearButton>
										<LinearButton
											variant="secondary"
											onClick={() => setIsLargeModalOpen(true)}
										>
											Large Modal
										</LinearButton>
									</div>
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>

					{/* Theme Colors Section */}
					<div className="space-y-8">
						<LinearH2>Theme Colors</LinearH2>
						<LinearCard>
							<LinearCardHeader>
								<LinearCardTitle>Color Palette</LinearCardTitle>
								<LinearCardDescription>
									The complete color system used throughout the Linear dark
									theme
								</LinearCardDescription>
							</LinearCardHeader>
							<LinearCardContent className="space-y-6">
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="space-y-2">
										<LinearText className="text-xs font-medium">
											Primary
										</LinearText>
										<div className="h-12 bg-[#E6E6E6] rounded border border-white/8"></div>
										<LinearCode>#E6E6E6</LinearCode>
									</div>
									<div className="space-y-2">
										<LinearText className="text-xs font-medium">
											Success
										</LinearText>
										<div className="h-12 bg-[#4CAF50] rounded border border-white/8"></div>
										<LinearCode>#4CAF50</LinearCode>
									</div>
									<div className="space-y-2">
										<LinearText className="text-xs font-medium">
											Warning
										</LinearText>
										<div className="h-12 bg-[#FF9800] rounded border border-white/8"></div>
										<LinearCode>#FF9800</LinearCode>
									</div>
									<div className="space-y-2">
										<LinearText className="text-xs font-medium">
											Error
										</LinearText>
										<div className="h-12 bg-[#F44336] rounded border border-white/8"></div>
										<LinearCode>#F44336</LinearCode>
									</div>
								</div>
							</LinearCardContent>
						</LinearCard>
					</div>
				</div>
			</LinearContainer>

			{/* Dialog Components */}
			<LinearDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				size="default"
			>
				<LinearDialogContent>
					<LinearDialogHeader>
						<LinearDialogTitle>Information</LinearDialogTitle>
						<LinearDialogCloseButton onClick={() => setIsDialogOpen(false)} />
					</LinearDialogHeader>
					<LinearDialogBody>
						<LinearText>
							This is a basic dialog example. It provides a simple way to
							display information or get user confirmation for actions.
						</LinearText>
						<LinearText className="mt-3">
							Dialogs are lightweight and perfect for quick notifications or
							simple confirmations.
						</LinearText>
					</LinearDialogBody>
					<LinearDialogFooter>
						<LinearButton
							variant="secondary"
							onClick={() => setIsDialogOpen(false)}
						>
							Close
						</LinearButton>
						<LinearButton variant="primary">Confirm</LinearButton>
					</LinearDialogFooter>
				</LinearDialogContent>
			</LinearDialog>

			<LinearDialog
				isOpen={isConfirmDialogOpen}
				onClose={() => setIsConfirmDialogOpen(false)}
				size="sm"
			>
				<LinearDialogContent>
					<LinearDialogHeader>
						<LinearDialogTitle>Confirm Action</LinearDialogTitle>
						<LinearDialogCloseButton
							onClick={() => setIsConfirmDialogOpen(false)}
						/>
					</LinearDialogHeader>
					<LinearDialogBody>
						<LinearText>
							Are you sure you want to delete this item? This action cannot be
							undone.
						</LinearText>
					</LinearDialogBody>
					<LinearDialogFooter>
						<LinearButton
							variant="secondary"
							onClick={() => setIsConfirmDialogOpen(false)}
						>
							Cancel
						</LinearButton>
						<LinearButton
							variant="error"
							onClick={() => setIsConfirmDialogOpen(false)}
						>
							Delete
						</LinearButton>
					</LinearDialogFooter>
				</LinearDialogContent>
			</LinearDialog>

			{/* Modal Components */}
			<LinearModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				size="default"
				closeOnOverlayClick={true}
				closeOnEscape={true}
			>
				<LinearModalContent>
					<LinearModalHeader>
						<LinearModalTitle>Welcome to Linear UI</LinearModalTitle>
						<LinearModalDescription>
							Discover the power of modern component design
						</LinearModalDescription>
						<LinearModalCloseButton onClick={() => setIsModalOpen(false)} />
					</LinearModalHeader>
					<LinearModalBody>
						<div className="space-y-4">
							<LinearText>
								Linear UI provides a comprehensive set of React components built
								with modern design principles and dark theme optimization.
							</LinearText>
							<div className="space-y-2">
								<LinearText>✓ TypeScript support</LinearText>
								<LinearText>✓ Dark theme optimized</LinearText>
								<LinearText>✓ Accessible by design</LinearText>
								<LinearText>✓ Customizable and extensible</LinearText>
							</div>
							<LinearText>
								Perfect for building modern web applications with consistent
								styling and excellent user experience.
							</LinearText>
						</div>
					</LinearModalBody>
					<LinearModalFooter>
						<LinearButton
							variant="secondary"
							onClick={() => setIsModalOpen(false)}
						>
							Close
						</LinearButton>
						<LinearButton variant="primary">Get Started</LinearButton>
					</LinearModalFooter>
				</LinearModalContent>
			</LinearModal>

			<LinearModal
				isOpen={isFormModalOpen}
				onClose={() => setIsFormModalOpen(false)}
				size="lg"
			>
				<LinearModalContent>
					<LinearModalHeader>
						<LinearModalTitle>Contact Form</LinearModalTitle>
						<LinearModalDescription>
							{`Send us a message and we'll get back to you`}
						</LinearModalDescription>
						<LinearModalCloseButton onClick={() => setIsFormModalOpen(false)} />
					</LinearModalHeader>
					<LinearModalBody>
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<LinearLabel htmlFor="firstName">First Name</LinearLabel>
									<LinearInput
										id="firstName"
										placeholder="Enter your first name"
									/>
								</div>
								<div className="space-y-2">
									<LinearLabel htmlFor="lastName">Last Name</LinearLabel>
									<LinearInput
										id="lastName"
										placeholder="Enter your last name"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<LinearLabel htmlFor="email">Email Address</LinearLabel>
								<LinearInput
									id="email"
									type="email"
									placeholder="Enter your email"
								/>
							</div>
							<div className="space-y-2">
								<LinearLabel htmlFor="subject">Subject</LinearLabel>
								<LinearInput id="subject" placeholder="What's this about?" />
							</div>
							<div className="space-y-2">
								<LinearLabel htmlFor="message">Message</LinearLabel>
								<LinearTextarea
									id="message"
									placeholder="Tell us more about your inquiry..."
									rows={4}
								/>
							</div>
						</div>
					</LinearModalBody>
					<LinearModalFooter>
						<LinearButton
							variant="secondary"
							onClick={() => setIsFormModalOpen(false)}
						>
							Cancel
						</LinearButton>
						<LinearButton variant="primary">Send Message</LinearButton>
					</LinearModalFooter>
				</LinearModalContent>
			</LinearModal>

			<LinearModal
				isOpen={isLargeModalOpen}
				onClose={() => setIsLargeModalOpen(false)}
				size="xl"
			>
				<LinearModalContent>
					<LinearModalHeader>
						<LinearModalTitle>Large Modal Example</LinearModalTitle>
						<LinearModalDescription>
							This modal demonstrates larger content layouts
						</LinearModalDescription>
						<LinearModalCloseButton
							onClick={() => setIsLargeModalOpen(false)}
						/>
					</LinearModalHeader>
					<LinearModalBody>
						<div className="space-y-6">
							<div>
								<LinearH3>About Linear UI</LinearH3>
								<LinearText className="mt-2">
									Linear UI is a comprehensive design system that provides
									developers with a complete toolkit for building modern web
									applications. Our components are designed with accessibility,
									performance, and developer experience in mind.
								</LinearText>
							</div>

							<div>
								<LinearH4>Key Features</LinearH4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
									<LinearCard>
										<LinearCardHeader>
											<LinearCardTitle>TypeScript First</LinearCardTitle>
										</LinearCardHeader>
										<LinearCardContent>
											<LinearText>
												Built with TypeScript for excellent developer experience
												and type safety.
											</LinearText>
										</LinearCardContent>
									</LinearCard>
									<LinearCard>
										<LinearCardHeader>
											<LinearCardTitle>Dark Theme</LinearCardTitle>
										</LinearCardHeader>
										<LinearCardContent>
											<LinearText>
												Optimized for dark interfaces with beautiful
												glassmorphism effects.
											</LinearText>
										</LinearCardContent>
									</LinearCard>
								</div>
							</div>

							<div>
								<LinearH4>Component Library</LinearH4>
								<LinearText className="mb-3">
									Our extensive component library includes:
								</LinearText>
								<div className="flex flex-wrap gap-2">
									<LinearTag label="Buttons" variant="primary" />
									<LinearTag label="Forms" variant="secondary" />
									<LinearTag label="Navigation" variant="accent" />
									<LinearTag label="Cards" variant="default" />
									<LinearTag label="Modals" variant="primary" />
									<LinearTag label="Dialogs" variant="secondary" />
									<LinearTag label="Typography" variant="accent" />
									<LinearTag label="Images" variant="default" />
								</div>
							</div>
						</div>
					</LinearModalBody>
					<LinearModalFooter>
						<LinearButton
							variant="secondary"
							onClick={() => setIsLargeModalOpen(false)}
						>
							Close
						</LinearButton>
						<LinearButton variant="info">Documentation</LinearButton>
						<LinearButton variant="primary">Get Started</LinearButton>
					</LinearModalFooter>
				</LinearModalContent>
			</LinearModal>
		</div>
	)
}
