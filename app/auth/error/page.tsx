'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'An unexpected authentication error occurred.'
  if (error === 'Configuration') {
    errorMessage = 'There is a configuration issue with the authentication service. Please try again or contact support.'
  } else if (error === 'AccessDenied') {
    errorMessage = 'You do not have permission to sign in.'
  } else if (error === 'Verification') {
    errorMessage = 'The verification token has expired or has already been used.'
  } else if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid email or password.'
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <CardTitle className="text-2xl">Authentication Error</CardTitle>
        <CardDescription>
          {errorMessage}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/auth/signin">
            Back to Sign In
          </Link>
        </Button>
        <div className="text-center">
          <Link href="/auth/signup" className="text-sm text-primary hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  )
}
