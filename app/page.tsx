import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          BrandBloom
        </h1>
        <p className="text-2xl text-gray-600 mb-4">
          Launch Your Store Without Writing Code
        </p>
        <p className="text-gray-500 max-w-2xl mb-8">
          Create, publish, and manage a professional online store with our multi-tenant e-commerce platform.
          No technical knowledge required.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Demo Store Available</h2>
          <p className="text-sm text-gray-600 mb-4">
            Try the demo with pre-loaded products and data:
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Demo credentials:</strong> owner@demo.com / demo123
            </p>
            <Link href="/store/demo-fashion-store" className="text-primary hover:underline block">
              View Demo Storefront →
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">🚀 Quick Setup</h3>
            <p className="text-sm text-gray-600">
              Launch your store in minutes with our guided onboarding wizard
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">🎨 Beautiful Themes</h3>
            <p className="text-sm text-gray-600">
              Choose from multiple professionally designed themes
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">🤖 AI Assistant</h3>
            <p className="text-sm text-gray-600">
              Get insights and recommendations with BloomPilot
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
