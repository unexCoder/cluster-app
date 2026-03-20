import { useState } from 'react'
import type { EventFormData, ValidationErrors } from '../../types/types'

const INITIAL_FORM_DATA: EventFormData = {
  name: '',
  description: '',
  shortDescription: '',
  venueId: '',
  startDateTime: '',
  endDateTime: '',
  doorsOpenTime: '',
  timezone: 'UTC',
  status: 'draft',
  isFeatured: false,
  ageRestriction: 'all_ages',
  eventType: '',
  categories: [],
  tags: [],
  mediaUrls: {
    images: [],
    videos: [],
    poster: ''
  },
  eventPolicies: {
    refundPolicy: '',
    accessibilityInfo: '',
    covidPolicies: '',
    prohibitedItems: [],
    generalRules: ''
  },
  remainingCapacity: ''
}

export const useEventForm = () => {
  const [formData, setFormData] = useState<EventFormData>(INITIAL_FORM_DATA)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const updateField = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.')
      if (keys.length === 1) {
        return { ...prev, [field]: value }
      }
      // Nested field update
      const [parent, child] = keys
      return {
        ...prev,
        [parent]: {
          ...(prev[parent as keyof EventFormData] as object),
          [child]: value
        }
      }
    })
  }

  const addCategory = (category: string) => {
    const trimmed = category.trim()
    if (trimmed && !formData.categories.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, trimmed]
      }))
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== categoryToRemove)
    }))
  }

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmed]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }))
  }

  const addMediaUrl = (type: 'images' | 'videos', url: string) => {
    const trimmed = url.trim()
    if (trimmed && !formData.mediaUrls[type].includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        mediaUrls: {
          ...prev.mediaUrls,
          [type]: [...prev.mediaUrls[type], trimmed]
        }
      }))
    }
  }

  const removeMediaUrl = (type: 'images' | 'videos', urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      mediaUrls: {
        ...prev.mediaUrls,
        [type]: prev.mediaUrls[type].filter(url => url !== urlToRemove)
      }
    }))
  }

  const addProhibitedItem = (item: string) => {
    const trimmed = item.trim()
    if (trimmed && !formData.eventPolicies.prohibitedItems.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        eventPolicies: {
          ...prev.eventPolicies,
          prohibitedItems: [...prev.eventPolicies.prohibitedItems, trimmed]
        }
      }))
    }
  }

  const removeProhibitedItem = (itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      eventPolicies: {
        ...prev.eventPolicies,
        prohibitedItems: prev.eventPolicies.prohibitedItems.filter(i => i !== itemToRemove)
      }
    }))
  }

  const clearFieldError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
    setError(null)
  }

  const validateStep = (step: number): boolean => {
    const errors: ValidationErrors = {}

    switch (step) {
      case 1:
        // Basic Information
        if (!formData.name.trim()) errors.name = 'Event name is required'
        if (!formData.description.trim()) errors.description = 'Description is required'
        if (!formData.eventType) errors.eventType = 'Event type is required'
        if (formData.shortDescription && formData.shortDescription.length > 500) {
          errors.shortDescription = 'Short description must be 500 characters or less'
        }
        break
      
      case 2:
        // Date, Time & Venue
        if (!formData.venueId) errors.venueId = 'Venue is required'
        if (!formData.startDateTime) errors.startDateTime = 'Start date and time is required'
        if (!formData.endDateTime) errors.endDateTime = 'End date and time is required'
        
        if (formData.startDateTime && formData.endDateTime) {
          const start = new Date(formData.startDateTime)
          const end = new Date(formData.endDateTime)
          if (end <= start) {
            errors.endDateTime = 'End date must be after start date'
          }
        }

        if (formData.doorsOpenTime && formData.startDateTime) {
          const doors = new Date(formData.doorsOpenTime)
          const start = new Date(formData.startDateTime)
          if (doors >= start) {
            errors.doorsOpenTime = 'Doors open time must be before start time'
          }
        }

        if (!formData.remainingCapacity.trim()) {
          errors.remainingCapacity = 'Remaining capacity is required'
        } else if (isNaN(Number(formData.remainingCapacity)) || Number(formData.remainingCapacity) < 0) {
          errors.remainingCapacity = 'Capacity must be a non-negative number'
        }
        break
      
      case 3:
        console.log('categories:', formData.categories)
        console.log('tags:', formData.tags)
        // Event Details (categories, tags, restrictions)
        // All optional, but could add custom validation if needed
        break
      
      case 4:
        // Media & Policies (optional)
        break
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setError(Object.values(errors)[0])
      return false
    }
    
    setValidationErrors({})
    return true
  }

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA)
    setValidationErrors({})
    setCurrentStep(1)
    setError(null)
    setCreating(false)
  }

  return {
    formData,
    validationErrors,
    currentStep,
    error,
    creating,
    updateField,
    addCategory,
    removeCategory,
    addTag,
    removeTag,
    addMediaUrl,
    removeMediaUrl,
    addProhibitedItem,
    removeProhibitedItem,
    clearFieldError,
    validateStep,
    setCurrentStep,
    setError,
    setCreating,
    setValidationErrors,
    setFormData,
    resetForm
  }
}