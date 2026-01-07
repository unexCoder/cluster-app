'use client'

import React, { useEffect, useState } from 'react'
import { fetchProfileAction, updateProfileAction } from '@/app/actions/profile'
import styles from './dashboardViews.module.css'
import styles_local from './updateProfile.module.css'

interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  role: string
  status: string
}

interface UpdateProfileProps {
  userId: string
  onNavigate?: (view: string) => void // ✅ Añadir prop
}

export default function UpdateProfile({ userId, onNavigate }: UpdateProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
  })

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const getRoleBadgeColor = () => {
    switch (profile?.role) {
      case "super_admin":
        return "#c30f45"
      case "admin":
        return "#c34545"
      case "staff":
        return "#250fc3"
      case "artist":
        return "#450fc3"
      case "customer":
      default:
        return "#059669"
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchProfileAction(userId)

      if (result.success && result.profile) {
        setProfile(result.profile as Profile)
        // Inicializar formulario con datos existentes
        setFormData({
          first_name: result.profile.first_name || '',
          last_name: result.profile.last_name || '',
          phone: result.profile.phone || '',
          email: result.profile.email || ''
        })
      } else {
        throw new Error(result.error || 'Failed to fetch profile')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error de validación al editar
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    // Limpiar mensajes
    setSuccess(null)
    setError(null)
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone format'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const result = await updateProfileAction(userId, formData)

      if (result.success && result.profile) {
        setSuccess('Profile updated successfully!')
        setProfile(result.profile as Profile)
        
        // ✅ Redirigir después de 1.5 segundos
        setTimeout(() => {
          onNavigate?.('Profile')
        }, 1500)

      } else {
        throw new Error(result.error || 'Failed to update profile')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      // Restaurar valores originales
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        email: profile.email || ''
      })
      setValidationErrors({})
      setError(null)
      setSuccess(null)
    }
    onNavigate?.('Profile')
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Profile not found</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Edit Profile</h2>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles_local.form}>
        <div className={styles_local.formSection}>
          <h3>Personal Information</h3>

          <div className={styles.formGroup}>
            <label htmlFor="first_name">
              First Name <span className={styles_local.required}>*</span>
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className={validationErrors.first_name ? styles.inputError : ''}
              disabled={saving}
            />
            {validationErrors.first_name && (
              <span className={styles.errorText}>{validationErrors.first_name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="last_name">
              Last Name <span className={styles_local.required}>*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className={validationErrors.last_name ? styles.inputError : ''}
              disabled={saving}
            />
            {validationErrors.last_name && (
              <span className={styles.errorText}>{validationErrors.last_name}</span>
            )}
          </div>
        </div>

        <div className={styles_local.formSection}>
          <h3>Contact Information</h3>

          <div className={styles.formGroup}>
            <label htmlFor="email">
              Email <span className={styles_local.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={validationErrors.email ? styles.inputError : ''}
              disabled={saving}
            />
            {validationErrors.email && (
              <span className={styles.errorText}>{validationErrors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1234567890"
              className={validationErrors.phone ? styles.inputError : ''}
              disabled={saving}
            />
            {validationErrors.phone && (
              <span className={styles.errorText}>{validationErrors.phone}</span>
            )}
          </div>
        </div>

        <div className={styles_local.formSection}>
          <h3>Account Information</h3>
          <div className={styles.infoGroup}>
            <label>Role:</label>
            <span 
              className={styles.readOnly}
              style={{color:getRoleBadgeColor()}}
              >
                {profile.role}
            </span>
          </div>
          <div className={styles.infoGroup}>
            <label>Status:</label>
            <span 
              className={styles.readOnly}
              style={{ color: profile.status === 'active' ? '#44ef44' : '#ef4444' }}
              >
                {profile.status}
              </span>
          </div>
        </div>

        <div className={styles_local.formActions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}