'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function useAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    const isAuthPage = pathname.startsWith('/auth')

    // If user is not authenticated and trying to access protected routes
    if (!user && !isAuthPage) {
      router.push('/auth/login')
      return
    }

    // If user is authenticated but on auth pages, redirect to dashboard
    if (user && isAuthPage) {
      router.push('/dashboard')
      return
    }
  }, [user, loading, pathname, router])

  return { user, loading }
}

export function useRequireAuth() {
  const { user, loading } = useAuthRedirect()

  return {
    user,
    loading,
    isAuthenticated: !!user,
  }
}