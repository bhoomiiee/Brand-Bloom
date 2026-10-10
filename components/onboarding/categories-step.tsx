'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCategoriesForBusinessType } from '@/lib/constants'

interface Props {
  businessType: string
  selectedCategories: string[]
  customCategories: string[]
  onNext: (categories: string[], customCategories: string[]) => void
  onBack: () => void
}

export default function CategoriesStep({
  businessType,
  selectedCategories: initialSelected,
  customCategories: initialCustom,
  onNext,
  onBack,
}: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelected)
  const [customCategories, setCustomCategories] = useState<string[]>(initialCustom)
  const [newCategory, setNewCategory] = useState('')

  const predefinedCategories = getCategoriesForBusinessType(businessType)

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }

  const addCustomCategory = () => {
    if (newCategory.trim() && !customCategories.includes(newCategory.trim())) {
      setCustomCategories(prev => [...prev, newCategory.trim()])
      setNewCategory('')
    }
  }

  const removeCustomCategory = (category: string) => {
    setCustomCategories(prev => prev.filter(c => c !== category))
  }

  const handleNext = () => {
    if (selectedCategories.length === 0 && customCategories.length === 0) {
      alert('Please select or add at least one category')
      return
    }
    onNext(selectedCategories, customCategories)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose your categories</h2>
        <p className="text-gray-600">
          Select categories for your products. You can always add more later.
        </p>
      </div>

      {/* Predefined Categories */}
      <div>
        <h3 className="font-semibold mb-3">Recommended Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {predefinedCategories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => toggleCategory(category.slug)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedCategories.includes(category.slug)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Categories */}
      <div>
        <h3 className="font-semibold mb-3">Add Custom Categories</h3>
        <div className="flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter custom category name"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustomCategory()
              }
            }}
          />
          <Button type="button" onClick={addCustomCategory} variant="outline">
            Add
          </Button>
        </div>

        {customCategories.length > 0 && (
          <div className="mt-4 space-y-2">
            {customCategories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span>{category}</span>
                <button
                  type="button"
                  onClick={() => removeCustomCategory(category)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Summary */}
      {(selectedCategories.length > 0 || customCategories.length > 0) && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Selected:</strong>{' '}
            {selectedCategories.length + customCategories.length} categories
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Next: Add Products
        </Button>
      </div>
    </div>
  )
}
