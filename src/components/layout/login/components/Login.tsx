'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { LoginFormData, loginSchema } from '@/components/common/types'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { loginUser } from '@/lib/store/slices/authSlice'
import { AuthGuard } from '@/components/auth/auth-guard'

const Login: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector(state => state.auth)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const credentials = {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      }
      await dispatch(loginUser(credentials)).unwrap()

      toast.success('Successfully signed in!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to sign in. Please check your credentials.')
    }
  }

  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                create a new account
              </Link>
            </p>
          </div>

          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...form.register('email')}
                    autoComplete="email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...form.register('password')}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        form.setValue(
                          'showPassword',
                          !form.watch('showPassword')
                        )
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                    >
                      {form.watch('showPassword') ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    {...form.register('rememberMe')}
                    className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default Login
