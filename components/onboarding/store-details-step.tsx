'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BUSINESS_TYPES } from '@/lib/constants'
import { slugify } from '@/lib/utils'

const storeDetailsSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens allowed'),
  description: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  businessType: z.string(),
}).superRefine((data, ctx) => {
  if (data.businessType === 'OTHER') {
    if (!data.description || data.description.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['description'],
        message: 'Description is compulsory when selecting "Other" category (e.g., "It is a boutique shop") so we can customize your website based on your business.',
      })
    }
  }
})

type StoreDetailsForm = z.infer<typeof storeDetailsSchema>

interface Props {
  data?: StoreDetailsForm
  onNext: (data: StoreDetailsForm) => void
}

export default function StoreDetailsStep({ data, onNext }: Props) {
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [slugError, setSlugError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StoreDetailsForm>({
    resolver: zodResolver(storeDetailsSchema),
    defaultValues: data || {
      businessType: 'FASHION',
    },
  })

  const name = watch('name')
  const slug = watch('slug')
  const selectedBusinessType = watch('businessType')
  const isOtherCategory = selectedBusinessType === 'OTHER'

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !slug) {
      setValue('slug', slugify(name))
    }
  }, [name, slug, setValue])

  // Check slug availability
  useEffect(() => {
    if (!slug || slug.length < 2) return

    const checkSlug = async () => {
      setIsCheckingSlug(true)
      setSlugError('')

      try {
        const response = await fetch(`/api/onboarding/check-slug?slug=${slug}`)
        const data = await response.json()

        if (!data.available) {
          setSlugError('This URL is already taken or reserved')
        }
      } catch (error) {
        console.error('Error checking slug:', error)
      } finally {
        setIsCheckingSlug(false)
      }
    }

    const debounce = setTimeout(checkSlug, 500)
    return () => clearTimeout(debounce)
  }, [slug])

  const onSubmit = (formData: StoreDetailsForm) => {
    if (slugError) return
    onNext(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tell us about your store</h2>
        <p className="text-gray-600">Basic information to get started</p>
      </div>

      <div className="space-y-4">
        {/* Store Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Store Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="My Amazing Store"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Store URL Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">
            Store URL <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">/store/</span>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="my-store"
              className="flex-1"
            />
          </div>
          {isCheckingSlug && (
            <p className="text-sm text-gray-500">Checking availability...</p>
          )}
          {slugError && (
            <p className="text-sm text-red-600">{slugError}</p>
          )}
          {errors.slug && (
            <p className="text-sm text-red-600">{errors.slug.message}</p>
          )}
          <p className="text-xs text-gray-500">
            This will be your store's unique web address
          </p>
        </div>

        {/* Business Type */}
        <div className="space-y-2">
          <Label htmlFor="businessType">
            Business Type <span className="text-red-500">*</span>
          </Label>
          <select
            id="businessType"
            {...register('businessType')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {BUSINESS_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description {isOtherCategory ? (
              <span className="text-red-500 font-semibold">* (Compulsory for Other category)</span>
            ) : (
              '(Optional)'
            )}
          </Label>
          <textarea
            id="description"
            {...register('description')}
            placeholder={
              isOtherCategory
                ? 'Compulsory: Describe what kind of shop you run (e.g., "It is a boutique shop selling dresses and handcrafted jewelry"). Our system will automatically build your website, banner, and products based on this description!'
                : 'Tell customers about your store...'
            }
            className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              errors.description ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
            }`}
            rows={3}
          />
          {isOtherCategory && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-start gap-2">
              <span className="text-base">✨</span>
              <div>
                <strong>Tailored Website Generator:</strong> Because you selected <em>Other</em>, this description is required. We use it to automatically generate matching products, high-quality pictures, categories, and hero banner for your store.
              </div>
            </div>
          )}
          {errors.description && (
            <p className="text-sm text-red-600 font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="contact@mystore.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Business Address (Optional)</Label>
          <textarea
            id="address"
            {...register('address')}
            placeholder="123 Main St, City, State, ZIP"
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || isCheckingSlug || !!slugError}
        >
          Next: Choose Categories
        </Button>
      </div>
    </form>
  )
}
