'use client'

import { useRouter } from 'next/navigation'
import { User, LogOut, LayoutDashboard, Package, Activity, Bell, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { logoutUser } from '@/lib/store/slices/authSlice'
import { toast } from 'sonner'
import { RootState } from '@/lib/store'
import Link from 'next/link'

export function Navbar() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading } = useAppSelector((state: RootState) => state.auth)

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
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Inventory Pro</h1>
          </div>

          <div className="flex items-center space-x-2">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Admin Info + Logout */}
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-100 text-blue-700 font-semibold rounded-full flex items-center justify-center text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden md:block text-sm">
              <div className="font-medium text-gray-900">{user.username}</div>
              <div className="text-xs text-gray-500 uppercase">{user.email}</div>
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
