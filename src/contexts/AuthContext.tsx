'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authService } from '@/lib/auth/auth-utils'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn({ email, password })
    return result
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
    setSession(null)
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()

        if (mounted) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        try {
          setSession(session)
          setUser(session?.user ?? null)
        } catch (error) {
          console.error('Error in auth state change:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}