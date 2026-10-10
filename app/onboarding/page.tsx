'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import StoreDetailsStep from '@/components/onboarding/store-details-step'
import CategoriesStep from '@/components/onboarding/categories-step'
import ProductsStep from '@/components/onboarding/products-step'
import ThemeStep from '@/components/onboarding/theme-step'
import ReviewStep from '@/components/onboarding/review-step'
import DeployedSuccessStep from '@/components/onboarding/deployed-success-step'

type OnboardingStep = 'details' | 'categories' | 'products' | 'theme' | 'review' | 'deployed'

interface OnboardingData {
  storeDetails?: {
    name: string
    slug: string
    description?: string
    logo?: string
    email?: string
    phone?: string
    address?: string
    businessType: string
  }
  categories?: string[]
  customCategories?: string[]
  productsMethod?: 'demo' | 'csv' | 'skip'
  csvFile?: File
  theme?: string
}

const STEPS: { id: OnboardingStep; title: string; description: string }[] = [
  { id: 'details', title: 'Store Details', description: 'Tell us about your business' },
  { id: 'categories', title: 'Categories', description: 'Choose product categories' },
  { id: 'products', title: 'Products', description: 'Add your first products' },
  { id: 'theme', title: 'Theme', description: 'Pick your store\'s look' },
  { id: 'review', title: 'Review', description: 'Review and publish' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('details')
  const [data, setData] = useState<OnboardingData>({})
  const [deployedStoreData, setDeployedStoreData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep)

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }))
  }

  const goToNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id)
    }
  }

  const goToPrevious = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to complete onboarding')
      }

      const result = await response.json()
      
      // If store created, show deployed success step with live link & share tools
      if (result.store) {
        setDeployedStoreData(result.store)
        setCurrentStep('deployed')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Failed to complete onboarding. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {currentStep !== 'deployed' && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Launch Your Store
              </h1>
              <p className="text-gray-600">
                Let's get your online store set up in just a few steps
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                          index <= currentStepIndex
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="text-center mt-2 hidden sm:block">
                        <div className={`text-sm font-medium ${
                          index <= currentStepIndex ? 'text-primary' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500 hidden md:block">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 transition-colors ${
                          index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step Content */}
        <Card className="p-6 mb-6">
          {currentStep === 'details' && (
            <StoreDetailsStep
              data={data.storeDetails}
              onNext={(storeDetails) => {
                updateData({ storeDetails })
                goToNext()
              }}
            />
          )}

          {currentStep === 'categories' && (
            <CategoriesStep
              businessType={data.storeDetails?.businessType || 'OTHER'}
              selectedCategories={data.categories || []}
              customCategories={data.customCategories || []}
              onNext={(categories, customCategories) => {
                updateData({ categories, customCategories })
                goToNext()
              }}
              onBack={goToPrevious}
            />
          )}

          {currentStep === 'products' && (
            <ProductsStep
              onNext={(productsMethod, csvFile) => {
                updateData({ productsMethod, csvFile })
                goToNext()
              }}
              onBack={goToPrevious}
            />
          )}

          {currentStep === 'theme' && (
            <ThemeStep
              selectedTheme={data.theme}
              onNext={(theme) => {
                updateData({ theme })
                goToNext()
              }}
              onBack={goToPrevious}
            />
          )}

          {currentStep === 'review' && (
            <ReviewStep
              data={data}
              onComplete={handleComplete}
              onBack={goToPrevious}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 'deployed' && (
            <DeployedSuccessStep
              store={
                deployedStoreData || {
                  name: data.storeDetails?.name,
                  slug: data.storeDetails?.slug,
                  businessType: data.storeDetails?.businessType,
                }
              }
            />
          )}
        </Card>

        {/* Mobile Step Indicator */}
        {currentStep !== 'deployed' && (
          <div className="text-center text-sm text-gray-600 sm:hidden">
            Step {currentStepIndex + 1} of {STEPS.length}: {STEPS[currentStepIndex]?.title}
          </div>
        )}
      </div>
    </div>
  )
}
