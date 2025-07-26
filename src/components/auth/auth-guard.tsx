'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { getCurrentUser, syncWithCookies } from '@/lib/store/slices/authSlice'
import Cookies from 'js-cookie'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
}: AuthGuardProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading, user } = useAppSelector(
    state => state.auth
  )
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First, sync with cookies to ensure state is consistent
        dispatch(syncWithCookies())

        // Check if token exists in cookies
        const token = Cookies.get('token')
        console.log('AuthGuard - token exists:', Boolean(token))
        console.log('AuthGuard - isAuthenticated:', isAuthenticated)
        console.log('AuthGuard - user:', user)

        if (requireAuth) {
          if (!token) {
            // No token found, redirect to login
            console.log('AuthGuard - No token found, redirecting to login')
            router.push(redirectTo)
            return
          }

          if (!isAuthenticated || !user) {
            // Token exists but user not authenticated, try to get current user
            console.log(
              'AuthGuard - Token exists but user not authenticated, fetching user'
            )
            try {
              await dispatch(getCurrentUser()).unwrap()
              console.log('AuthGuard - User fetched successfully')
            } catch (error) {
              console.log('error', error)
              console.log(
                'AuthGuard - Failed to fetch user, redirecting to login'
              )
              router.push(redirectTo)
              return
            }
          }
        } else {
          // For auth pages (login/register), redirect to dashboard if already authenticated
          if (isAuthenticated && user) {
            console.log(
              'AuthGuard - User already authenticated, redirecting to dashboard'
            )
            router.push('/dashboard')
            return
          }
        }
      } catch (error) {
        console.error('AuthGuard - Error checking auth:', error)
        if (requireAuth) {
          router.push(redirectTo)
        }
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [dispatch, isAuthenticated, user, requireAuth, router, redirectTo])

  // Show loading state while checking authentication
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Don't render children if auth requirements are not met
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
