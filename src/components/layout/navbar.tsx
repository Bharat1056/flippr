'use client'

import { useRouter } from 'next/navigation'
import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { logoutUser } from '@/lib/store/slices/authSlice'
import { toast } from 'sonner'
import { RootState } from '@/lib/store'

export function Navbar() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state: RootState) => state.auth
  )

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser('ADMIN')).unwrap()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.log('error', error)
      toast.error('Failed to logout')
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-sm text-gray-600">Welcome,</span>
            <span className="ml-1 font-medium text-gray-900">
              {user.name || user.email}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  )
}
