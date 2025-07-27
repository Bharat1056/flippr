'use client'

import { useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, Package, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { logoutUser } from '@/lib/store/slices/authSlice'
import { toast } from 'sonner'
import { RootState } from '@/lib/store'
import Link from 'next/link'

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

  if (!isAuthenticated || !user) return null

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/products', icon: Package },
    // { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Activity Logs', href: '/activity', icon: Activity },
  ]

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-6">
        {/* Left Side: Brand + Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Inventory Pro</h1>
          </div>

          <div className="flex items-center space-x-2">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-blue-600"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Admin Info + Logout */}
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-2 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
