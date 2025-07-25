import { ResetPasswordPage } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface Params {
  access_token: string
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Params>
}) {
  const accessToken = (await searchParams).access_token

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Invalid Reset Link
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    The password reset link is invalid or has expired.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    Request a new reset link
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <ResetPasswordPage accessToken={accessToken} />
}
