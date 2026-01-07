'use client'

import React, { useEffect, useState } from 'react'
import styles from './dashboardViews.module.css'
import styles_local from './displayProfile.module.css'
import { fetchProfileAction } from '@/app/actions/profile'

interface Profile {
  id: string
  email: string
  email_verified_at: Date | null
  phone: string | null
  phone_verified_at: Date | null
  password_hash: string
  first_name: string
  last_name: string
  ssn_encrypted: string | null
  role: string
  status: string
  last_login_at: Date | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

interface DisplayProfileProps {
  userId: string // Recibe el ID como prop
  onNavigate?: (view: string) => void // Añadir prop para navegación
}

export default function DisplayProfile({ userId, onNavigate }: DisplayProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
  }, [userId]) // Re-fetch si cambia el userId

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchProfileAction(userId) // Pasa el ID

      if (result.success && result.profile) {
        setProfile(result.profile)
      } else {
        throw new Error(result.error || 'Failed to fetch profile')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchProfile} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Profile not found</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>User Profile</h2>
      </div>

      <div className={styles.profileCard}>
        <div className={styles_local.profileSection}>
          <h3>Personal Information</h3>
          <div className={styles_local.profileField}>
            <label>Name:</label>
            <span>{profile.first_name} {profile.last_name}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Phone:</label>
            {profile.phone && <span>{ formatInternationalWithDashes(profile.phone) || 'N/A'}</span>}
          </div>
        </div>

        <div className={styles_local.profileSection}>
          <h3>Account Details</h3>
          <div className={styles_local.profileField}>
            <label>Role:</label>
            <span 
              className={styles_local.roleBadge} 
              style={{color: getRoleBadgeColor()}}
              >
                {profile.role}
              </span>
          </div>
          <div className={styles_local.profileField}>
            <label>Status:</label>
            <span 
              className={styles.statusBadge}
              style={{ color: profile.status === 'active' ? '#44ef44' : '#ef4444' }}
            >
              {profile.status}
            </span>
          </div>
          <div className={styles_local.profileField}>
            <label>Email Verified:</label>
            <span>{profile.email_verified_at ? 'Verified' : 'Not verified'}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Phone Verified:</label>
            <span>{profile.phone_verified_at ? 'Verified' : 'Not verified'}</span>
          </div>
        </div>

        <div className={styles_local.profileSection}>
          <h3>Activity</h3>
          <div className={styles_local.profileField}>
            <label>Last Login:</label>
            <span>
              {profile.last_login_at 
                ? new Date(profile.last_login_at).toLocaleString()
                : 'Never'}
            </span>
          </div>
          <div className={styles_local.profileField}>
            <label>Created:</label>
            <span>{new Date(profile.created_at).toLocaleString()}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Updated:</label>
            <span>{new Date(profile.updated_at).toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.actionButton}
            onClick={() => onNavigate?.('Update Profile')}
            >
              Edit Profile
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => onNavigate?.('Change Password')}
            >
              Change Password
          </button>
          {profile.role === 'super_admin' && (profile.status === 'active' ? (          
            <button className={styles.dangerButton}>Deactivate</button>
          ) : (
            <button className={styles.successButton}>Activate</button>
          ))} 
        </div>
      </div>
    </div>
  )
}

const formatInternationalWithDashes = (input: string): string => {
  const cleaned = input.replace(/[^\d+]/g, "");

  // +CC AAA XXX XXXX
  return cleaned.replace(/^(\+\d{2})(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3-$4");
};