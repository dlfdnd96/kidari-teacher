import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import * as z from 'zod/mini'
import { ActivityRecordSchema } from '@/shared/schemas/landing'

async function createClient() {
	const cookieStore = await cookies()
	const supabase = {
		url: z.string().parse(process.env.SUPABASE_URL),
		anonKey: z.string().parse(process.env.SUPABASE_ANON_KEY),
	}

	return createServerClient(supabase.url, supabase.anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options),
					)
				} catch {}
			},
		},
	})
}

export async function GET() {
	try {
		const bucketName = z.string().parse(process.env.SUPABASE_BUCKET_NAME)

		const supabase = await createClient()

		const { data, error } = await supabase.storage
			.from(bucketName)
			.download('landing/activity-records.json')

		if (error) {
			console.error('Error downloading activity data:', error)
			return NextResponse.json(
				{ error: 'Failed to fetch activity data' },
				{ status: 500 },
			)
		}

		const text = await data.text()
		const activityData = ActivityRecordSchema.parse(JSON.parse(text))

		return NextResponse.json(activityData, {
			headers: {
				'Cache-Control':
					'public, max-age=604800, stale-while-revalidate=1209600', // 7 days cache, 14 days stale
			},
		})
	} catch (error) {
		console.error('Error fetching activity data:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
