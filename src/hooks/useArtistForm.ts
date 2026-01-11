import { useState } from 'react'
import type { ArtistFormData, ValidationErrors } from '../../types/types'

const INITIAL_FORM_DATA: ArtistFormData = {
  name: '',
  stageName: '',
  bio: '',
  pictureUrl: '',
  genres: [],
  contactInfo: {
    name: '',
    lastName: '',
    email: '',
    phone: ''
  },
  socialLinks: {
    website: '',
    instagram: '',
    facebook: '',
    twitter: '',
    spotify: '',
    youtube: '',
    tiktok: ''
  },
  technical: {
    requirements: '',
    riderUrl: '',
    presskitUrl: ''
  }
}

export const useArtistForm = () => {
  const [formData, setFormData] = useState<ArtistFormData>(INITIAL_FORM_DATA)
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
          ...(prev[parent as keyof ArtistFormData] as object),
          [child]: value
        }
      }
    })
  }

  const addGenre = (genre: string) => {
    const trimmed = genre.trim()
    if (trimmed && !formData.genres.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, trimmed]
      }))
    }
  }

  const removeGenre = (genreToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genreToRemove)
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
        if (!formData.name.trim()) errors.name = 'Artist name is required'
        if (!formData.stageName.trim()) errors.stageName = 'Stage name is required'
        if (!formData.pictureUrl.trim()) errors.pictureUrl = 'Picture URL is required'
        if (!formData.bio.trim()) errors.bio = 'Bio is required'
        if (formData.genres.length === 0) errors.genres = 'Add at least one genre'
        break
      case 2:
        if (!formData.contactInfo.email.trim()) {
          errors['contactInfo.email'] = 'Contact email is required'
        }
        break
      case 3:
        // Social links are optional
        break
      case 4:
        if (!formData.technical.requirements.trim() && !formData.technical.riderUrl.trim()) {
          errors.technical = 'Technical requirements or rider URL is required'
        }
        break
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setError(Object.values(errors)[0])
      return false
    }
    
    setValidationErrors(errors)
    return true
  }

  return {
    formData,
    validationErrors,
    currentStep,
    error,
    creating,
    updateField,
    addGenre,
    removeGenre,
    clearFieldError,
    validateStep,
    setCurrentStep,
    setError,
    setCreating,
    setValidationErrors,
    setFormData
    // setError
  }
}