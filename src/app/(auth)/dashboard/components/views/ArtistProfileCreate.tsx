'use client'

import React, { useState } from 'react'
import styles from './dashboardViews.module.css'
import styles_local from './artistProfile.module.css'
import styles_x from './artistProfileCreate.module.css'

interface ArtistProfileCreateProps {
  userId?: string
  // onSuccess?: () => void
  // onCancel?: () => void
  onNavigate?: (view: string) => void
}

export default function ArtistProfileCreate({ userId, onNavigate }: ArtistProfileCreateProps) {
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Form fields
  const [name, setName] = useState('')
  const [stageName, setStageName] = useState('')
  const [bio, setBio] = useState('')
  const [pictureUrl, setPictureUrl] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [genreInput, setGenreInput] = useState('')

  // Contact info
  const [contactName, setContactName] = useState('')
  const [contactLastName, setContactLastName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Social links
  const [website, setWebsite] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [spotify, setSpotify] = useState('')
  const [youtube, setYoutube] = useState('')
  const [tiktok, setTiktok] = useState('')

  // Technical
  const [technicalRequirements, setTechnicalRequirements] = useState('')
  const [riderUrl, setRiderUrl] = useState('')
  const [presskitUrl, setPresskitUrl] = useState('')

  const handleAddGenre = () => {
    if (genreInput.trim() && !genres.includes(genreInput.trim())) {
      setGenres([...genres, genreInput.trim()])
      setGenreInput('')
    }
  }

  const handleRemoveGenre = (genreToRemove: string) => {
    setGenres(genres.filter(g => g !== genreToRemove))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!name.trim()) {
          setError('Artist name is required')
          return false
        }
        return true
      case 2:
        // Contact info is optional
        return true
      case 3:
        // Social links are optional
        return true
      case 4:
        // Technical info is optional
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    setError(null)
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setError(null)
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    try {
      setCreating(true)
      setError(null)

      // Prepare data for submission
      const formData = {
        user_id: userId,
        name,
        stage_name: stageName,
        bio,
        picture_url: pictureUrl,
        genres,
        contact_info: {
          name: contactName,
          last_name: contactLastName,
          email: contactEmail,
          phone: contactPhone
        },
        social_links: {
          website,
          instagram,
          facebook,
          twitter,
          spotify,
          youtube,
          tiktok
        },
        technical_requirements: technicalRequirements,
        rider_url: riderUrl,
        presskit_url: presskitUrl
      }

      // TODO: Call your create action here
      // const result = await createArtistProfileAction(formData)

      console.log('Form data to submit:', formData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // if (onSuccess) {
      //   onSuccess()
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile')
    } finally {
      setCreating(false)
    }
  }

  const renderStepIndicator = () => (
    <div className={styles_x.stepIndicatorContainer}>
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={styles_x.stepContainer}>
            <div
              className={styles_x.step}
              style={{
                background: currentStep >= step ? '#3b82f6' : '#e5e7eb',
                color: currentStep >= step ? 'white' : '#6b7280',
              }}>
              {step}
            </div>
            <span style={{
              fontSize: '12px',
              color: currentStep >= step ? '#3b82f6' : '#6b7280',
              fontWeight: currentStep === step ? '600' : '400',
              textAlign: 'center'
            }}>
              {step === 1 && 'Basic Info'}
              {step === 2 && 'Contact'}
              {step === 3 && 'Social Media'}
              {step === 4 && 'Technical'}
            </span>
          </div>
          {step < 4 && (
            <div
              className={styles_x.separator}
              style={{
                background: currentStep > step ? '#3b82f6' : '#e5e7eb',
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className={styles_local.formSection}>
      <h3 className={styles_local.sectionTitle}>Basic Information</h3>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
        Tell us about yourself and your music
      </p>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
        <label htmlFor="name">Artist Name *</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
          placeholder="Enter your artist name"
        />
      </div>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
        <label htmlFor="stageName">Stage Name</label>
        <input
          id="stageName"
          type="text"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          className={styles.input}
          placeholder="Enter your stage name (optional)"
        />
      </div>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
        <label htmlFor="pictureUrl">Profile Picture URL</label>
        <input
          id="pictureUrl"
          type="url"
          value={pictureUrl}
          onChange={(e) => setPictureUrl(e.target.value)}
          className={styles.input}
          placeholder="https://example.com/image.jpg"
        />
        {pictureUrl && (
          <div style={{ marginTop: '12px' }}>
            <img
              src={pictureUrl}
              alt="Preview"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid #e5e7eb'
              }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        )}
      </div>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
        <label htmlFor="bio">Biography</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={styles.input}
          rows={5}
          placeholder="Tell us about yourself, your music style, and your journey..."
        />
      </div>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
        <label>Genres</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
            className={styles.input}
            placeholder="Add a genre (e.g., Rock, Jazz, Electronic)"
          />
          <button
            type="button"
            onClick={handleAddGenre}
            className={styles.actionButton}
            style={{ minWidth: '80px' }}
          >
            Add
          </button>
        </div>
      </div>
      {genres.length > 0 && (
        <div className={styles_local.tagsContainer}>
          {genres.map((genre, index) => (
            <span key={index} 
                className={styles_local.tags}
                style={{display:'flex', justifyContent:'center',alignItems:'center', fontWeight:'799'}}
              >
              {genre}
              <button
                type="button"
                onClick={() => handleRemoveGenre(genre)}
                style={{
                  marginLeft: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className={ `${styles_local.formSection} ${styles_x.formSection}` }>
      <h3 className={styles_local.sectionTitle}>Contact Information</h3>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
        How can venues and promoters reach you?
      </p>

      <div className={styles_x.contact}>
        <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
          <label htmlFor="contactName">First Name</label>
          <input
            id="contactName"
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className={styles.input}
            placeholder="First name"
          />
        </div>

        <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
          <label htmlFor="contactLastName">Last Name</label>
          <input
            id="contactLastName"
            type="text"
            value={contactLastName}
            onChange={(e) => setContactLastName(e.target.value)}
            className={styles.input}
            placeholder="Last name"
          />
        </div>
      </div>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
        <label htmlFor="contactEmail">Email</label>
        <input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className={styles.input}
          placeholder="contact@example.com"
        />
      </div>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
        <label htmlFor="contactPhone">Phone</label>
        <input
          id="contactPhone"
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className={styles.input}
          placeholder="+1 (555) 123-4567"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className={`${styles_local.formSection} ${styles_x.formSection}`}>
      <h3 className={styles_local.sectionTitle}>Social Media</h3>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
        Connect your social media profiles and streaming platforms
      </p>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className={styles.input}
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div className={styles_x.links}>
        <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
          <label htmlFor="instagram">Instagram</label>
          <input
            id="instagram"
            type="url"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className={styles.input}
            placeholder="https://instagram.com/yourprofile"
          />
        </div>

        <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
          <label htmlFor="facebook">Facebook</label>
          <input
            id="facebook"
            type="url"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className={styles.input}
            placeholder="https://facebook.com/yourpage"
          />
        </div>

        <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
          <label htmlFor="twitter">Twitter</label>
          <input
            id="twitter"
            type="url"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className={styles.input}
            placeholder="https://twitter.com/yourprofile"
          />
        </div>

        <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
          <label htmlFor="spotify">Spotify</label>
          <input
            id="spotify"
            type="url"
            value={spotify}
            onChange={(e) => setSpotify(e.target.value)}
            className={styles.input}
            placeholder="https://open.spotify.com/artist/..."
          />
        </div>

        <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
          <label htmlFor="youtube">YouTube</label>
          <input
            id="youtube"
            type="url"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            className={styles.input}
            placeholder="https://youtube.com/@yourchannel"
          />
        </div>

        <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
          <label htmlFor="tiktok">TikTok</label>
          <input
            id="tiktok"
            type="url"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            className={styles.input}
            placeholder="https://tiktok.com/@yourprofile"
          />
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className={ `${styles_local.formSection} ${styles_x.formSection}` } >
      <h3 className={styles_local.sectionTitle}>Technical Requirements & Documents</h3>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
        Share your technical needs and promotional materials
      </p>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup} ${styles_x.step4width}`}>
        <label htmlFor="technicalRequirements">Technical Requirements</label>
        <textarea
          id="technicalRequirements"
          value={technicalRequirements}
          onChange={(e) => setTechnicalRequirements(e.target.value)}
          className={styles.input}
          rows={4}
          placeholder="List your technical requirements for performances (e.g., sound equipment, lighting, stage setup)..."
        />
      </div>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup} ${styles_x.step4width}`}>
        <label htmlFor="riderUrl">Technical Rider URL</label>
        <input
          id="riderUrl"
          type="url"
          value={riderUrl}
          onChange={(e) => setRiderUrl(e.target.value)}
          className={styles.input}
          placeholder="https://example.com/rider.pdf"
        />

      </div>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          Link to your technical rider document
        </p>

      <div className={`${styles.infoGroup} ${styles_x.infoGroup} ${styles_x.step4width}`}>
        <label htmlFor="presskitUrl">Press Kit URL</label>
        <input
          id="presskitUrl"
          type="url"
          value={presskitUrl}
          onChange={(e) => setPresskitUrl(e.target.value)}
          className={styles.input}
          placeholder="https://example.com/presskit.pdf"
        />
      </div>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          Link to your press kit with photos, bio, and promotional materials
        </p>
    </div>
  )

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2>Create Artist Profile</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Step {currentStep} of {totalSteps}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            // onCancel?.()
            onNavigate?.('Artist Profile')
          }}
          className={styles.actionButton}
          style={{ background: '#6b7280' }}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className={styles.error} style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className={styles_local.profileCard}>
        {renderStepIndicator()}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={styles.actionButton}
              style={{
                background: currentStep === 1 ? '#e5e7eb' : '#6b7280',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className={styles.actionButton}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={styles.actionButton}
                disabled={creating}
              >
                {creating ? 'Creating Profile...' : 'Create Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}