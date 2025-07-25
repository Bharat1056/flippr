'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { ResetPasswordFormData, resetPasswordSchema } from '../types'

const ResetPasswordPage: React.FC<{ accessToken: string }> = ({
  accessToken,
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!accessToken) {
      toast.error('Invalid or missing reset token')
      return
    }

    try {
      setIsLoading(true)

      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Reset password request:', {
        accessToken,
        newPassword: data.password,
      })

      setIsSuccess(true)
      toast.success('Password reset successfully!')
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Password Reset Successfully
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been updated. You can now sign in with your new
              password.
            </p>
          </div>

          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Password Updated
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Your password has been successfully reset. You can now sign
                    in with your new password.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/login"
                    className="bg-primary hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        <Card className="w-full">
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={form.watch('showPassword') ? 'text' : 'password'}
                    placeholder="Enter your new password"
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
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={
                      form.watch('showConfirmPassword') ? 'text' : 'password'
                    }
                    placeholder="Confirm your new password"
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
                  <p className="text-destructive text-sm">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
