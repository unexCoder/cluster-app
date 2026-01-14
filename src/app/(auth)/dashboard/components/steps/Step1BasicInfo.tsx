import React, { useState } from 'react'
import { FormField } from '../components/FormField'
import { ImageField } from '../components/ImageField'
import type { ArtistFormData, ValidationErrors } from '../../../../../../types/types'
// import Image from 'next/image'
import { artistInfoSchema } from '@/lib/validations/artistProfile'
import { z } from 'zod'
import { getImageUploadUrl } from '@/app/actions/upload-file'


interface Step1Props {
  formData: ArtistFormData
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  addGenre: (genre: string) => void
  removeGenre: (genre: string) => void
  setValidationError?: (field: string, error: string) => void
}

// Map component field names (camelCase) to schema field names (snake_case)
const fieldNameMap: Record<string, keyof typeof artistInfoSchema.shape> = {
  name: 'name',
  stageName: 'stage_name',
  pictureUrl: 'picture_url',
  bio: 'bio',
  genres: 'genres'
}

export const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
  addGenre,
  removeGenre,
  setValidationError
}) => {
  const [genreInput, setGenreInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [fileKey, setFileKey] = useState(0)

  // Validate individual field
  const validateField = (fieldName: string, value: any) => {
    try {
      // Map camelCase field name to snake_case schema field
      const schemaFieldName = fieldNameMap[fieldName]
      if (!schemaFieldName) {
        console.warn(`No schema mapping found for field: ${fieldName}`)
        return false
      }

      const fieldSchema = artistInfoSchema.shape[schemaFieldName]
      if (fieldSchema) {
        fieldSchema.parse(value)
        clearFieldError(fieldName)
        return true
      }
      return false
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (setValidationError && error.issues.length > 0) {
          setValidationError(fieldName, error.issues[0].message)
        }
      }
      return false
    }
  }

  // Enhanced updateField with validation
  const handleFieldChange = (field: string, value: any) => {
    updateField(field, value)
    // Clear error immediately when user starts typing
    clearFieldError(field)
  }

  // Validate on blur
  const handleFieldBlur = (field: string) => {
    let value: any

    switch (field) {
      case 'name':
        value = formData.name
        break
      case 'stageName':
        value = formData.stageName
        break
      case 'pictureUrl':
        value = formData.pictureUrl
        break
      case 'bio':
        value = formData.bio
        break
      case 'genres':
        value = formData.genres
        break
      default:
        return
    }

    validateField(field, value)
  }

  const handleAddGenre = () => {
    if (!genreInput.trim()) {
      setValidationError?.('genres', 'Genre cannot be empty')
      return
    }

    const tags = genreInput.trim().split(',')
    const unique = [...new Set(tags)]; // elimina duplicados

    if (unique.length > 0) {
      unique.map((t) => {
        if (formData.genres.includes(t.trim())) {
          setValidationError?.('genres', 'Genre already added')
          return
        }
        if (formData.genres.length >= 5) {
          setValidationError?.('genres', 'Maximum 5 genres allowed')
          return
        }
        addGenre(t.trim().toLowerCase())
      })
    }

    // addGenre(genreInput.trim().toLowerCase())
    setGenreInput('')
    clearFieldError('genres')
  }

  const handleRemoveGenre = (genre: string) => {
    removeGenre(genre)
    // Re-validate genres after removal
    setTimeout(() => {
      validateField('genres', formData.genres.filter(g => g !== genre))
    }, 0)
  }


  // Handle file selection and upload
  const handleFileSelect = async (file: File | null) => {
    // Clear everything if no file
    if (!file) {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl('')
      updateField('pictureUrl', '')
      return
    }

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setValidationError?.('pictureUrl', 'Only JPG, PNG, and WebP images are allowed')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError?.('pictureUrl', 'Image must be less than 5MB')
      return
    }

    // Create local preview
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)
    clearFieldError('pictureUrl')

    // Upload to S3
    setIsUploading(true)
    try {
      // Get presigned URL from server
      const response = await getImageUploadUrl(file.name, file.type)

      if (!response.success || !response.uploadUrl) {
        throw new Error(response.error || 'Failed to get upload URL')
      }

      // Upload file to S3 using presigned URL
      const uploadResponse = await fetch(response.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      // Update form with the public URL
      updateField('pictureUrl', response.publicUrl)
      console.log('✅ Image uploaded successfully:', response.publicUrl)
    } catch (error) {
      console.error('Upload error:', error)
      setValidationError?.('pictureUrl', 'Failed to upload image. Please try again.')
      setPreviewUrl('')
    } finally {
      setIsUploading(false)
    }
  }

  // Validate all fields (can be called from parent)
  const validateAll = () => {
    try {
      // Map camelCase to snake_case for schema validation
      const dataToValidate = {
        name: formData.name,
        stage_name: formData.stageName,
        bio: formData.bio,
        picture_url: formData.pictureUrl,
        genres: formData.genres
      }

      artistInfoSchema.parse(dataToValidate)
      return true
    } catch (error) {
      if (error instanceof z.ZodError && setValidationError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          // Map snake_case back to camelCase for error display
          const displayField = field === 'stage_name' ? 'stageName'
            : field === 'picture_url' ? 'pictureUrl'
              : field
          setValidationError(displayField, issue.message)
        })
      }
      return false
    }
  }

  const isValidHttpUrl = (value: string) => {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'blob:'
    } catch {
      return false
    }
  }

  const handleRemoveImage = () => {
    updateField('pictureUrl', '')
    setPreviewUrl('')
    setFileKey(k => k + 1)
    // Clean up object URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  const displayUrl = previewUrl || formData.pictureUrl
  const hasImage = isValidHttpUrl(displayUrl)

  // style
  const fieldClassName = 'infoGroup'

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
        Basic Information
      </h3>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
        Tell us about yourself and your music
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField
          label="Artist Name"
          name="name"
          value={formData.name}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          onBlur={() => handleFieldBlur('name')}
          required
          placeholder="Enter your artist name"
          error={validationErrors.name}
          className={fieldClassName}
        />

        <FormField
          label="Stage Name"
          name="stageName"
          value={formData.stageName}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          onBlur={() => handleFieldBlur('stageName')}
          required
          placeholder="Enter your stage name"
          error={validationErrors.stageName}
          className={fieldClassName}
        />


        {/* Image Upload using FileField */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
          <ImageField
            label="Profile Picture"
            name="pictureFile"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            onFocus={clearFieldError}
            required
            maxSize={5 * 1024 * 1024}
            isUploading={isUploading}
            error={validationErrors.pictureUrl}
            className={fieldClassName}
            helperText="JPG, PNG, or WebP (max 5MB)"
            key={fileKey}
          />
        </div>

        {/* Image Preview */}
        {hasImage && isValidHttpUrl(displayUrl) && !isUploading && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={displayUrl}
              alt="Artist preview"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                objectFit: 'cover'
              }}
              onError={(e) => {
                console.error('Image failed to load')
                setPreviewUrl('')
                updateField('pictureUrl', '')
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              title="Remove image"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Upload Status Overlay */}
            {isUploading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '500' }}>
                  Uploading...
                </span>
              </div>
            )}
          </div>
        )}

        <FormField
          label="Biography"
          name="bio"
          value={formData.bio}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          onBlur={() => handleFieldBlur('bio')}
          required
          placeholder="Tell us about yourself, your music style, and your journey..."
          rows={5}
          error={validationErrors.bio}
          className={fieldClassName}
        />

        <div className={fieldClassName}>
          <label>
            Genres
            <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddGenre()
                }
              }}
              onFocus={() => clearFieldError('genres')}
              placeholder="Add a genre (e.g., Rock, Jazz)"
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              type="button"
              onClick={handleAddGenre}
              style={{
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Add
            </button>
          </div>
          {validationErrors.genres && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {validationErrors.genres}
            </span>
          )}
        </div>

        {formData.genres.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {formData.genres.map((genre, index) => (
              <span
                key={index}
                style={{
                  padding: '6px 12px',
                  background: '#eff6ff',
                  color: '#3b82f6',
                  borderRadius: '16px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {genre}
                <button
                  type="button"
                  onClick={() => handleRemoveGenre(genre)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: 0,
                    color: 'inherit'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}