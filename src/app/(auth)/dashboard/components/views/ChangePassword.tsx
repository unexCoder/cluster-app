// components/views/ChangePassword.tsx
'use client'

import React, { useState } from 'react'
import { changePasswordAction } from '@/app/actions/profile'
import styles from './dashboardViews.module.css'
import styles_local from './changePassword.module.css'
import { FormField } from '../components/FormField'

interface ChangePasswordProps {
  userId: string
  onNavigate?: (view: string) => void
}

export default function ChangePassword({ userId, onNavigate }: ChangePasswordProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    setSuccess(null)
    setError(null)
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (formData.currentPassword && formData.newPassword &&
      formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password'
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
      setLoading(true)
      setError(null)
      setSuccess(null)

      const result = await changePasswordAction(
        userId,
        formData.currentPassword,
        formData.newPassword
      )

      if (result.success) {
        setSuccess('Password changed successfully!')

        // Limpiar el formulario
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })

        // Redirigir después de 2 segundos
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('Profile')
          }
        }, 2000)

      } else {
        throw new Error(result.error || 'Failed to change password')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onNavigate) {
      onNavigate('Profile')
    } else {
      // Limpiar formulario
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setValidationErrors({})
      setError(null)
      setSuccess(null)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles_local.form}>
        <div className={styles.header}>
          <h2>Change Password</h2>
        </div>
        <div className={styles.formSection} style={{ width: '300px' }}>
          <h3>Password Information</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
            Choose a strong password with at least 8 characters.
          </p>
          <div style={{ position: 'relative', display: 'flex', paddingBottom: '20px' }}>
            <FormField
              label="Current Password"
              name="currentPassword"
              value={formData.currentPassword}
              required
              onChange={(name, value) => {
                setFormData(prev => ({ ...prev, [name]: value }))
                if (validationErrors[name]) {
                  setValidationErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors[name]
                    return newErrors
                  })
                }
                setSuccess(null)
                setError(null)
              }}
              placeholder="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              error={validationErrors.currentPassword}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className={styles_local.visibility}
            >
              {showPasswords.current ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className={styles_local.formGroup}>
            <div style={{ position: 'relative', display: 'flex' }}>
              <FormField
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                required
                onChange={(name, value) => {
                  setFormData(prev => ({ ...prev, [name]: value }))
                  if (validationErrors[name]) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors[name]
                      return newErrors
                    })
                  }
                  setSuccess(null)
                  setError(null)
                }}
                placeholder="New Password"
                type={showPasswords.new ? 'text' : 'password'}
                error={validationErrors.newPassword}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className={styles_local.visibility}
              >
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className={styles_local.formGroup}>
            <div style={{ position: 'relative', display: 'flex' }}>
              <FormField
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                required
                onChange={(name, value) => {
                  setFormData(prev => ({ ...prev, [name]: value }))
                  if (validationErrors[name]) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors[name]
                      return newErrors
                    })
                  }
                  setSuccess(null)
                  setError(null)
                }}
                placeholder="Confirm Password"
                type={showPasswords.confirm ? 'text' : 'password'}
                error={validationErrors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className={styles_local.visibility}
              >
                {showPasswords.current ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        {success && (
          <div className={styles.error}>
            {success}
          </div>
        )}

        <div className={styles_local.formActions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  )
}