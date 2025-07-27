'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import {
  registerSchema,
  RegisterFormData,
  UserRole,
} from '@/components/common/types'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { registerUser } from '@/lib/store/slices/authSlice'
import { AuthGuard } from '@/components/auth/auth-guard'

const Register: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector(state => state.auth)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.ADMIN,
      showPassword: false,
      showConfirmPassword: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const credentials = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }
      await dispatch(registerUser(credentials)).unwrap()

      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to create account. Please try again.')
    }
  }

  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <Card className="w-full">
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    {...form.register('fullName')}
                    autoComplete="name"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    Enter your first and last name
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...form.register('username')}
                    autoComplete="username"
                  />
                  {form.formState.errors.username && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.username.message}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    Choose a unique username (letters, numbers, and underscores
                    only)
                  </p>
                </div>

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
                      type={form.watch('showPassword') ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      {...form.register('password')}
                      autoComplete="new-password"
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
                  <p className="text-muted-foreground text-xs">
                    Must contain uppercase, lowercase, number, and special
                    character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={
                        form.watch('showConfirmPassword') ? 'text' : 'password'
                      }
                      placeholder="Confirm your password"
                      {...form.register('confirmPassword')}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        form.setValue(
                          'showConfirmPassword',
                          !form.watch('showConfirmPassword')
                        )
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                    >
                      {form.watch('showConfirmPassword') ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-destructive text-xs">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Select Role</Label>
                  <div className="flex gap-3">
                    {(['admin', 'staff'] as const).map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => form.setValue('role', role)}
                        className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
                          form.watch('role') === role
                            ? 'bg-primary border-primary text-white shadow-md'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {role === 'admin' ? 'Administrator' : 'Staff Member'}
                      </button>
                    ))}
                  </div>
                  {form.formState.errors.role && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.role.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              By creating an account, you agree to our{' '}
              <Link
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default Register
