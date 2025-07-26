'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAdminRegister , useStaffRegister } from '@/lib/hooks/use-auth'
import {
  registerSchema,
  RegisterFormData,
  UserRole,
  UserRoleType,
} from '@/components/common/types'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const Register: React.FC = () => {
  const router = useRouter()
  const { mutate: register, isPending: isLoading } = useAdminRegister()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.STAFF,
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
      const response = await register(credentials)
      console.log(response,"register");
      
      toast.success('Account created successfully!')
      router.push('/login')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to create account. Please try again.')
    }
  }

  return (
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      form.setValue('showPassword', !form.watch('showPassword'))
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
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.watch('role')}
                  onValueChange={value =>
                    form.setValue('role', value as UserRoleType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>
                      Administrator
                    </SelectItem>
                    <SelectItem value={UserRole.STAFF}>Staff Member</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
  )
}

export default Register
