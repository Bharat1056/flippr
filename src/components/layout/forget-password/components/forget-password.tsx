'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Loader2, ArrowLeft } from 'lucide-react'
import { ForgotPasswordFormData, forgotPasswordSchema } from '../types'

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isEmailSent, setIsEmailSent] = React.useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)

      // Simulate API call to send reset password email
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Forgot password request for:', data.email)

      // In a real app, you would call your API here
      // await authService.forgotPassword(data.email)

      setIsEmailSent(true)
      toast.success('Password reset link sent to your email!')
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;ve sent a password reset link to your email address.
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
                    Email sent successfully
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Please check your inbox and follow the instructions to reset
                    your password.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    ← Back to login
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
            Forgot your password?
          </h2>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email address below and we&apos;ll send you a password
              reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...form.register('email')}
                  autoComplete="email"
                />
                {form.formState.errors.email && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
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

export default ForgotPasswordPage
