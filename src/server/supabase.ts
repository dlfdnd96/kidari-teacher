import { cookies } from 'next/headers'
import * as z from 'zod/mini'
import { createServerClient } from '@supabase/ssr'

const createSupabaseClient = async () => {
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
				cookiesToSet.forEach(({ name, value, options }) =>
					cookieStore.set(name, value, options),
				)
			},
		},
	})
}

export const client = createSupabaseClient
