'use client'

import {
	AchievementsSection,
	ContactSection,
	HeroSection,
	HowToCollaborateSection,
	MembersSection,
	PurposeSection,
	SchoolFeedbackSection,
	TopNavbar,
} from '@/components/features/landing/components'

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-background relative">
			<TopNavbar />
			<HeroSection />
			<MembersSection />
			<PurposeSection />
			<AchievementsSection />
			<SchoolFeedbackSection />
			<HowToCollaborateSection />
			<ContactSection />
		</div>
	)
}
