import { useState } from 'react'
import type { VenueFormData, ValidationErrors } from '../../types/types'

const INITIAL_FORM_DATA: VenueFormData = {
  name: '',
  description: '',
  capacity: '',
  address: '',
  city: '',
  country: '',
  latitude: '',
  longitude: '',
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    website: ''
  },
  venueInfo: {
    type: '',
    amenities: [],
    accessibility: '',
    parkingInfo: '',
    publicTransport: ''
  },
  imageUrls: []
}

export const useVenueForm = () => {
  const [formData, setFormData] = useState<VenueFormData>(INITIAL_FORM_DATA)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [currentStep, setCurrentStep] = useState(1)
  // const [error, setError] = useState<string | null>(null)
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
          ...(prev[parent as keyof VenueFormData] as object),
          [child]: value
        }
      }
    })
  }

  const addAmenity = (amenity: string) => {
    const trimmed = amenity.trim()
    if (trimmed && !formData.venueInfo.amenities.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        venueInfo: {
          ...prev.venueInfo,
          amenities: [...prev.venueInfo.amenities, trimmed]
        }
      }))
    }
  }

  const removeAmenity = (amenityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      venueInfo: {
        ...prev.venueInfo,
        amenities: prev.venueInfo.amenities.filter(a => a !== amenityToRemove)
      }
    }))
  }

  const addImageUrl = (url: string) => {
    const trimmed = url.trim()
    if (trimmed && !formData.imageUrls.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, trimmed]
      }))
    }
  }

  const removeImageUrl = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== urlToRemove)
    }))
  }

  const clearFieldError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
    // setError(null)
  }

  // const validateStep = (step: number): boolean => {
  //   const errors: ValidationErrors = {}

  //   switch (step) {
  //     case 1:
  //       // Basic Information
  //       if (!formData.name.trim()) errors.name = 'Venue name is required'
  //       if (!formData.description.trim()) errors.description = 'Description is required'
  //       if (!formData.capacity.trim()) {
  //         errors.capacity = 'Capacity is required'
  //       } else if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
  //         errors.capacity = 'Capacity must be a positive number'
  //       }
  //       break
      
  //     case 2:
  //       // Location Information
  //       if (!formData.address.trim()) errors.address = 'Address is required'
  //       if (!formData.city.trim()) errors.city = 'City is required'
  //       if (!formData.country.trim()) errors.country = 'Country is required'
        
  //       if (formData.latitude.trim()) {
  //         const lat = Number(formData.latitude)
  //         if (isNaN(lat) || lat < -90 || lat > 90) {
  //           errors.latitude = 'Latitude must be between -90 and 90'
  //         }
  //       }
        
  //       if (formData.longitude.trim()) {
  //         const lng = Number(formData.longitude)
  //         if (isNaN(lng) || lng < -180 || lng > 180) {
  //           errors.longitude = 'Longitude must be between -180 and 180'
  //         }
  //       }
  //       break
      
  //     case 3:
  //       // Contact Information
  //       if (!formData.contactInfo.email.trim()) {
  //         errors['contactInfo.email'] = 'Contact email is required'
  //       } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
  //         errors['contactInfo.email'] = 'Please enter a valid email address'
  //       }
  //       break
      
  //     case 4:
  //       // Venue Details & Images (optional fields)
  //       break
  //   }

  //   if (Object.keys(errors).length > 0) {
  //     setValidationErrors(errors)
  //     setError(Object.values(errors)[0])
  //     return false
  //   }
    
  //   setValidationErrors({})
  //   return true
  // }

  

  return {
    formData,
    validationErrors,
    currentStep,
    // error,
    creating,
    updateField,
    addAmenity,
    removeAmenity,
    addImageUrl,
    removeImageUrl,
    clearFieldError,
    // validateStep,
    setCurrentStep,
    // setError,
    setCreating,
    setValidationErrors,
    setFormData
  }
}