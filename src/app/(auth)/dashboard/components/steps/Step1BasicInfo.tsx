import React, { useState } from 'react'
import { FormField } from '../components/FormField'
import type { ArtistFormData, ValidationErrors } from '../../../../../../types/types'
import Image from 'next/image';

interface Step1Props {
  formData: ArtistFormData
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  addGenre: (genre: string) => void
  removeGenre: (genre: string) => void
}

export const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
  addGenre,
  removeGenre
}) => {
  const [genreInput, setGenreInput] = useState('')

  const handleAddGenre = () => {
    addGenre(genreInput)
    setGenreInput('')
  }

  const fieldClassName = 'infoGroup' // Replace with your actual class

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Basic Information</h3>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
        Tell us about yourself and your music
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField
          label="Artist Name"
          name="name"
          value={formData.name}
          onChange={updateField}
          onFocus={clearFieldError}
          required
          placeholder="Enter your artist name"
          error={validationErrors.name}
          className={fieldClassName}
        />

        <FormField
          label="Stage Name"
          name="stageName"
          value={formData.stageName}
          onChange={updateField}
          onFocus={clearFieldError}
          required
          placeholder="Enter your stage name"
          error={validationErrors.stageName}
          className={fieldClassName}
        />

        <FormField
          label="Profile Picture URL"
          name="pictureUrl"
          type="url"
          value={formData.pictureUrl}
          onChange={updateField}
          onFocus={clearFieldError}
          required
          placeholder="https://example.com/image.jpg"
          error={validationErrors.pictureUrl}
          className={fieldClassName}
        />

        {formData.pictureUrl && (
          <div>

            <Image
              src={formData.pictureUrl}
              width={500}
              height={500}
              alt="Picture of the artist"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                objectFit: 'cover'
              }}
            />


            <button
              type="button"
              onClick={() => updateField('pictureUrl', '')}
              style={{
                marginLeft: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ×
            </button>
          </div>
        )}

        <FormField
          label="Biography"
          name="bio"
          value={formData.bio}
          onChange={updateField}
          onFocus={clearFieldError}
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
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
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
                  onClick={() => removeGenre(genre)}
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