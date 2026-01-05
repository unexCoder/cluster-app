// components/views/ChangePassword.tsx
'use client'

import React, { useState } from 'react'
import { changePasswordAction } from '@/app/actions/profile'
import styles from './dashboardViews.module.css'
import styles_local from './changePassword.module.css'

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
      {/* {onNavigate && (
        <div className={styles.breadcrumb}>
          <span 
            onClick={() => onNavigate('Profile')}
            style={{ cursor: 'pointer', color: '#3b82f6', textDecoration: 'underline' }}
          >
            ← Back to Profile
          </span>
        </div>
      )} */}

      <div className={styles.header}>
        <h2>Change Password</h2>
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
        <div className={styles.formSection}>
          <h3>Password Information</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
            Choose a strong password with at least 8 characters.
          </p>

          <div className={styles_local.formGroup}>
            <label htmlFor="currentPassword">
              Current Password <span className={styles_local.required}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={validationErrors.currentPassword ? styles.inputError : ''}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className={styles_local.visibility}
              >
                {showPasswords.current ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.currentPassword && (
              <span className={styles.errorText}>{validationErrors.currentPassword}</span>
            )}
          </div>

          <div className={styles_local.formGroup}>
            <label htmlFor="newPassword">
              New Password <span className={styles_local.required}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={validationErrors.newPassword ? styles.inputError : ''}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className={styles_local.visibility}
              >
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.newPassword && (
              <span className={styles.errorText}>{validationErrors.newPassword}</span>
            )}
          </div>

          <div className={styles_local.formGroup}>
            <label htmlFor="confirmPassword">
              Confirm New Password <span className={styles_local.required}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={validationErrors.confirmPassword ? styles.inputError : ''}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className={styles_local.visibility}
              >
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <span className={styles.errorText}>{validationErrors.confirmPassword}</span>
            )}
          </div>
        </div>

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