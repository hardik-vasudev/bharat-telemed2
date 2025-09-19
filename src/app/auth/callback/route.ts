import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  // Handle authentication errors
  if (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=verification_failed', request.url))
  }

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(new URL('/auth/login?error=verification_failed', request.url))
      }

      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(new URL('/dashboard', request.url))

    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
      return NextResponse.redirect(new URL('/auth/login?error=unexpected_error', request.url))
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url))
}