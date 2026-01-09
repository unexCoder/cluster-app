'use client'

import { useArtistForm } from '@/hooks/useArtistForm'
import React from 'react'
import styles from './artistProfileCreate.module.css'
import { StepIndicator } from '../components/StepIndicator'
import { Step1BasicInfo } from '../steps/Step1BasicInfo'
import { Step2ContactInfo } from '../steps/Step2ContactInfo'
import { Step3socialLinks } from '../steps/Step3SocialLinks'
import { Step4TechInfo } from '../steps/Step4TechInfo'

interface ArtistProfileCreateProps {
  userId?: string
  onNavigate?: (view: string) => void
}

export default function ArtistProfileCreate({ userId, onNavigate }: ArtistProfileCreateProps) {
  const {
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
    setCreating
  } = useArtistForm()

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    try {
      setCreating(true)
      // Call your API
      // await createArtistProfileAction({ ...formData, user_id: userId })
      console.log('Submitting:', formData)
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Create Artist Profile</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Step {currentStep} of 4
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.('Artist Profile')}
          style={{
            padding: '0 16px',
            height: '24px',
            alignSelf:'flex-end',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>

      <div style={{ background: '#ff00ff66', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <StepIndicator currentStep={currentStep} />

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <Step1BasicInfo
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              addGenre={addGenre}
              removeGenre={removeGenre}
            />
          )}

          {currentStep === 2 && (
            <Step2ContactInfo
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
            />
          )}

          {currentStep === 3 && (
            <Step3socialLinks
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
            />
          )}

          {currentStep === 4 && (
            <Step4TechInfo
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
            />
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                style={{
                  padding: '10px 24px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  padding: '10px 24px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginLeft: 'auto'
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={creating}
                style={{
                  padding: '10px 24px',
                  background: creating ? '#93c5fd' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: creating ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  marginLeft: 'auto'
                }}
              >
                {creating ? 'Creating...' : 'Create Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

// 'use client'

// import React, { useState } from 'react'
// import styles from './dashboardViews.module.css'
// import styles_local from './artistProfile.module.css'
// import styles_x from './artistProfileCreate.module.css'
// import Image from 'next/image';
// import { createArtistProfileAction } from '@/app/actions/artists'
// import { color } from 'three/tsl'

// interface ArtistProfileCreateProps {
//   userId?: string
//   // onSuccess?: () => void
//   // onCancel?: () => void
//   onNavigate?: (view: string) => void
// }

// export default function ArtistProfileCreate({ userId, onNavigate }: ArtistProfileCreateProps) {
//   const [creating, setCreating] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [currentStep, setCurrentStep] = useState(1)
//   const totalSteps = 4

//   // Form fields
//   const [name, setName] = useState('')
//   const [stageName, setStageName] = useState('')
//   const [bio, setBio] = useState('')
//   const [pictureUrl, setPictureUrl] = useState('')
//   const [genres, setGenres] = useState<string[]>([])
//   const [genreInput, setGenreInput] = useState('')

//   // Contact info
//   const [contactName, setContactName] = useState('')
//   const [contactLastName, setContactLastName] = useState('')
//   const [contactEmail, setContactEmail] = useState('')
//   const [contactPhone, setContactPhone] = useState('')

//   // Social links
//   const [website, setWebsite] = useState('')
//   const [instagram, setInstagram] = useState('')
//   const [facebook, setFacebook] = useState('')
//   const [twitter, setTwitter] = useState('')
//   const [spotify, setSpotify] = useState('')
//   const [youtube, setYoutube] = useState('')
//   const [tiktok, setTiktok] = useState('')

//   // Technical
//   const [technicalRequirements, setTechnicalRequirements] = useState('')
//   const [riderUrl, setRiderUrl] = useState('')
//   const [presskitUrl, setPresskitUrl] = useState('')

//   const handleAddGenre = () => {
//     if (genreInput.trim() && !genres.includes(genreInput.trim())) {
//       setGenres([...genres, genreInput.trim()])
//       setGenreInput('')
//     }
//   }

//   const handleRemoveGenre = (genreToRemove: string) => {
//     setGenres(genres.filter(g => g !== genreToRemove))
//   }

//   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

//   const validateStep = (step: number): boolean => {
//     const errors: Record<string, string> = {}

//     switch (step) {
//       case 1:
//         if (!name.trim()) {
//           setError('Artist name is required')
//           errors.nameRequired = 'Artist name is required'
//           setValidationErrors(errors)
//           return false
//         }
//         if (!stageName.trim()) {
//           setError('Artist stage name is required')
//           errors.stageNameRequired = 'Artist stage name is required'
//           setValidationErrors(errors)
//           return false
//         }
//         if (!pictureUrl.trim()) {
//           setError('Picture url is required')
//           errors.pictureUrlRequired = 'Picture url is required'
//           setValidationErrors(errors)
//           return false
//         }
//         if (!bio.trim()) {
//           setError('Bio is required')
//           errors.bioRequired = 'Bio is required'
//           setValidationErrors(errors)
//           return false
//         }
//         if (genres.length < 1) {
//           setError('Add at least one genre')
//           errors.genresRequired = 'Add at least one genre'
//           setValidationErrors(errors)
//           return false
//         }
//         return true
//       case 2:
//         if (!contactEmail.trim()) {
//           setError('Contact email is required')
//           errors.contactEmailRequired = 'Contact email is required'
//           setValidationErrors(errors)
//           return false
//         }
//         return true
//       case 3:
//         // Social links are optional
//         return true
//       case 4:
//         if (!technicalRequirements.trim() && !riderUrl.trim()) {
//           setError('Technical requirements or tech rider url are required')
//           errors.technicalRequired = 'Include technical rider url or technical details'
//           setValidationErrors(errors)
//           return false
//         }
//         return true
//       default:
//         return true
//     }
//   }

//   const clearFieldError = (field: string) => {
//     const errorKey = `${field}Required`  // Convert 'name' to 'nameRequired'

//     if (validationErrors[errorKey]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev }
//         delete newErrors[errorKey]
//         return newErrors
//       })
//     }

//     setError(null)
//     setSuccess(null)
//   }

//   const handleNext = () => {
//     setError(null)
//     if (validateStep(currentStep)) {
//       setCurrentStep(currentStep + 1)
//     }
//   }

//   const handlePrevious = () => {
//     setError(null)
//     setCurrentStep(currentStep - 1)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateStep(currentStep)) {
//       return
//     }

//     try {
//       setCreating(true)
//       setError(null)

//       // Prepare data for submission
//       const formData = {
//         user_id: userId,
//         name,
//         stage_name: stageName,
//         bio,
//         picture_url: pictureUrl,
//         genres,
//         contact_info: {
//           name: contactName,
//           last_name: contactLastName,
//           email: contactEmail,
//           phone: contactPhone
//         },
//         social_links: {
//           website,
//           instagram,
//           facebook,
//           twitter,
//           spotify,
//           youtube,
//           tiktok
//         },
//         technical_requirements: technicalRequirements,
//         rider_url: riderUrl,
//         presskit_url: presskitUrl
//       }

//       // TODO: Call your create action here
//       const result = await createArtistProfileAction(formData as any)
//       console.log('Form data to submit:', formData)

//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000))

//       // if (onSuccess) {
//       //   onSuccess()
//       // }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to create profile')
//     } finally {
//       setCreating(false)
//     }
//   }

//   const renderStepIndicator = () => (
//     <div className={styles_x.stepIndicatorContainer}>
//       {[1, 2, 3, 4].map((step) => (
//         <React.Fragment key={step}>
//           <div className={styles_x.stepContainer}>
//             <div
//               className={styles_x.step}
//               style={{
//                 background: currentStep >= step ? '#3b82f6' : '#e5e7eb',
//                 color: currentStep >= step ? 'white' : '#6b7280',
//               }}>
//               {step}
//             </div>
//             <span style={{
//               fontSize: '12px',
//               color: currentStep >= step ? '#3b82f6' : '#6b7280',
//               fontWeight: currentStep === step ? '600' : '400',
//               textAlign: 'center'
//             }}>
//               {step === 1 && 'Basic Info'}
//               {step === 2 && 'Contact'}
//               {step === 3 && 'Social Media'}
//               {step === 4 && 'Technical'}
//             </span>
//           </div>
//           {step < 4 && (
//             <div
//               className={styles_x.separator}
//               style={{
//                 background: currentStep > step ? '#3b82f6' : '#e5e7eb',
//               }}
//             />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   )

//   const renderStep1 = () => (
//     <div className={styles_local.formSection}>
//       <h3 className={styles_local.sectionTitle}>Basic Information</h3>
//       <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
//         Tell us about yourself and your music
//       </p>

//       <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//         <label htmlFor="name">Artist Name <span className={styles_x.required}>*</span></label>
//         <input
//           id="name"
//           type="text"
//           value={name}
//           // onChange={(e) => setName(e.target.value)}
//           onChange={(e) => setName(e.target.value)}
//           onFocus={() => clearFieldError('name')}
//           required
//           className={styles.input}
//           placeholder="Enter your artist name"
//         />
//       </div>
//       {validationErrors.nameRequired && (
//         <span className={styles_x.errorText}>{validationErrors.nameRequired}</span>
//       )}

//       <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//         <label htmlFor="stageName">Stage Name <span className={styles_x.required}>*</span></label>
//         <input
//           id="stageName"
//           type="text"
//           required
//           value={stageName}
//           onChange={(e) => setStageName(e.target.value)}
//           className={styles.input}
//           placeholder="Enter your stage name (optional)"
//           onFocus={() => clearFieldError('stageName')}
//         />
//       </div>
//       {validationErrors.stageNameRequired && (
//         <span className={styles_x.errorText}>{validationErrors.stageNameRequired}</span>
//       )}

//       <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//         <label htmlFor="pictureUrl">Profile Picture URL <span className={styles_x.required}>*</span></label>
//         <input
//           id="pictureUrl"
//           type="url"
//           // required
//           value={pictureUrl}
//           onChange={(e) => setPictureUrl(e.target.value)}
//           className={styles.input}
//           placeholder="https://example.com/image.jpg"
//           style={pictureUrl ? { display: 'none' } : { display: 'block' }}
//           onFocus={() => clearFieldError('pictureUrl')}
//         />
//         {pictureUrl && (
//           <div style={{ marginTop: '12px' }}>
//             <Image
//               src={pictureUrl}
//               width={120}
//               height={0}
//               alt={stageName}
//               style={{
//                 borderRadius: '8px',
//                 border: '1px solid #e5e7eb',
//                 height: 'auto'
//               }}
//             />
//             <button
//               type="button"
//               onClick={() => setPictureUrl('')}
//               style={{
//                 marginLeft: '8px',
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 color: 'inherit',
//                 fontSize: '16px'
//               }}
//             >
//               ×
//             </button>
//           </div>
//         )}
//       </div>
//       {validationErrors.pictureUrlRequired && (
//         <span className={styles_x.errorText}>{validationErrors.pictureUrlRequired}</span>
//       )}


//       <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//         <label htmlFor="bio">Biography <span className={styles_x.required}>*</span></label>
//         <textarea
//           id="bio"
//           value={bio}
//           onChange={(e) => setBio(e.target.value)}
//           className={styles.input}
//           rows={5}
//           placeholder="Tell us about yourself, your music style, and your journey..."
//           onFocus={() => clearFieldError('bio')}
//         />
//       </div>
//       {validationErrors.bioRequired && (
//         <span className={styles_x.errorText}>{validationErrors.bioRequired}</span>
//       )}

//       <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//         <label>Genres </label><span className={styles_x.required}>*</span>
//         <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
//           <input
//             type="text"
//             value={genreInput}
//             onChange={(e) => setGenreInput(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
//             className={styles.input}
//             placeholder="Add a genre (e.g., Rock, Jazz, Electronic)"
//             onFocus={() => clearFieldError('genres')}  // Add this
//           />
//           <button
//             type="button"
//             onClick={handleAddGenre}
//             className={styles.actionButton}
//             style={{ minWidth: '80px' }}
//           >
//             Add
//           </button>
//         </div>
//       </div>
//       {genres.length > 0 && (
//         <div className={styles_local.tagsContainer}>
//           {genres.map((genre, index) => (
//             <span key={index}
//               className={styles_local.tags}
//               style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '799' }}
//             >
//               {genre}
//               <button
//                 type="button"
//                 onClick={() => handleRemoveGenre(genre)}
//                 style={{
//                   marginLeft: '8px',
//                   background: 'none',
//                   border: 'none',
//                   cursor: 'pointer',
//                   color: 'inherit',
//                   fontSize: '16px'
//                 }}
//               >
//                 ×
//               </button>
//             </span>
//           ))}
//         </div>
//       )}
//       <>
//         {validationErrors.genresRequired && (
//           <span className={styles_x.errorText}>{validationErrors.genresRequired}</span>
//         )}
//       </>
//     </div>

//   )

//   const renderStep2 = () => (
//     <div className={`${styles_local.formSection} ${styles_x.formSection}`}>
//       <h3 className={styles_local.sectionTitle}>Contact Information</h3>
//       <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
//         How can venues and promoters reach you?
//       </p>

//       <div className={styles_x.contact}>
//         <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//           <label htmlFor="contactName">First Name</label>
//           <input
//             id="contactName"
//             type="text"
//             value={contactName}
//             onChange={(e) => setContactName(e.target.value)}
//             className={styles.input}
//             placeholder="First name"
//           />
//         </div>

//         <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//           <label htmlFor="contactLastName">Last Name</label>
//           <input
//             id="contactLastName"
//             type="text"
//             value={contactLastName}
//             onChange={(e) => setContactLastName(e.target.value)}
//             className={styles.input}
//             placeholder="Last name"
//           />
//         </div>
//       </div>

//       <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//         <label htmlFor="contactEmail">Email <span className={styles_x.required}>*</span></label>
//         <input
//           id="contactEmail"
//           type="email"
//           required
//           onFocus={() => clearFieldError('contactEmail')}  // Add this
//           value={contactEmail}
//           onChange={(e) => setContactEmail(e.target.value)}
//           className={styles.input}
//           placeholder="contact@example.com"
//         />
//       </div>
//       {validationErrors.contactEmailRequired && (
//         <span className={styles_x.errorText}>{validationErrors.contactEmailRequired}</span>
//       )}

//       <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//         <label htmlFor="contactPhone">Phone</label>
//         <input
//           id="contactPhone"
//           type="tel"
//           value={contactPhone}
//           onChange={(e) => setContactPhone(e.target.value)}
//           className={styles.input}
//           placeholder="+1 (555) 123-4567"
//         />
//       </div>
//     </div>
//   )

//   const renderStep3 = () => (
//     <div className={`${styles_local.formSection} ${styles_x.formSection}`}>
//       <h3 className={styles_local.sectionTitle}>Social Media</h3>
//       <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
//         Connect your social media profiles and streaming platforms
//       </p>

//       <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//         <label htmlFor="website">Website</label>
//         <input
//           id="website"
//           type="url"
//           value={website}
//           onChange={(e) => setWebsite(e.target.value)}
//           className={styles.input}
//           placeholder="https://yourwebsite.com"
//         />
//       </div>

//       <div className={styles_x.links}>
//         <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//           <label htmlFor="instagram">Instagram</label>
//           <input
//             id="instagram"
//             type="url"
//             value={instagram}
//             onChange={(e) => setInstagram(e.target.value)}
//             className={styles.input}
//             placeholder="https://instagram.com/yourprofile"
//           />
//         </div>

//         <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//           <label htmlFor="facebook">Facebook</label>
//           <input
//             id="facebook"
//             type="url"
//             value={facebook}
//             onChange={(e) => setFacebook(e.target.value)}
//             className={styles.input}
//             placeholder="https://facebook.com/yourpage"
//           />
//         </div>

//         <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//           <label htmlFor="twitter">Twitter</label>
//           <input
//             id="twitter"
//             type="url"
//             value={twitter}
//             onChange={(e) => setTwitter(e.target.value)}
//             className={styles.input}
//             placeholder="https://twitter.com/yourprofile"
//           />
//         </div>

//         <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//           <label htmlFor="spotify">Spotify</label>
//           <input
//             id="spotify"
//             type="url"
//             value={spotify}
//             onChange={(e) => setSpotify(e.target.value)}
//             className={styles.input}
//             placeholder="https://open.spotify.com/artist/..."
//           />
//         </div>

//         <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//           <label htmlFor="youtube">YouTube</label>
//           <input
//             id="youtube"
//             type="url"
//             value={youtube}
//             onChange={(e) => setYoutube(e.target.value)}
//             className={styles.input}
//             placeholder="https://youtube.com/@yourchannel"
//           />
//         </div>

//         <div className={`${styles.infoGroup} ${styles_x.infoGroup}`}>
//           <label htmlFor="tiktok">TikTok</label>
//           <input
//             id="tiktok"
//             type="url"
//             value={tiktok}
//             onChange={(e) => setTiktok(e.target.value)}
//             className={styles.input}
//             placeholder="https://tiktok.com/@yourprofile"
//           />
//         </div>
//       </div>
//     </div>
//   )

//   const renderStep4 = () => (
//     <div className={`${styles_local.formSection} ${styles_x.formSection}`} >
//       <h3 className={styles_local.sectionTitle}>Technical Requirements & Documents</h3>
//       <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
//         Share your technical needs and promotional materials
//       </p>

//       <div className={`${styles.infoGroup} ${styles_x.infoGroup} ${styles_x.step4width}`}>
//         <label htmlFor="technicalRequirements">Technical Requirements <span style={{color:'#ff0'}}>*</span></label>
//         <textarea
//           id="technicalRequirements"
//           value={technicalRequirements}
//           // required
//           onChange={(e) => setTechnicalRequirements(e.target.value)}
//           onFocus={() => clearFieldError('technical')}  // Add this
//           className={styles.input}
//           rows={4}
//           placeholder="List your technical requirements for performances (e.g., sound equipment, lighting, stage setup)..."
//         />
//       </div>

//       <div className={`${styles.infoGroup} ${styles_x.infoGroup} ${styles_x.step4width}`}>
//         <label htmlFor="riderUrl">Technical Rider URL <span style={{color:'#ff0'}}>*</span></label>
//         <input
//           id="riderUrl"
//           type="url"
//           value={riderUrl}
//           onChange={(e) => setRiderUrl(e.target.value)}
//           onFocus={() => clearFieldError('technical')}  // Add this
//           className={styles.input}
//           placeholder="https://example.com/rider.pdf"
//         />
//       </div>
//       <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
//         Link to your technical rider document
//       </p>
//       {validationErrors.technicalRequired && (
//         <span className={styles_x.errorText}>{validationErrors.technicalRequired}</span>
//       )}


//       <div className={`${styles.infoGroup} ${styles_x.infoGroup} ${styles_x.step4width}`}>
//         <label htmlFor="presskitUrl">Press Kit URL</label>
//         <input
//           id="presskitUrl"
//           type="url"
//           value={presskitUrl}
//           onChange={(e) => setPresskitUrl(e.target.value)}
//           className={styles.input}
//           placeholder="https://example.com/presskit.pdf"
//         />
//       </div>
//       <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
//         Link to your press kit with photos, bio, and promotional materials
//       </p>
//     </div>
//   )

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <div>
//           <h2>Create Artist Profile</h2>
//           <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
//             Step {currentStep} of {totalSteps}
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => {
//             // onCancel?.()
//             onNavigate?.('Artist Profile')
//           }}
//           className={styles.actionButton}
//           style={{ background: '#6b7280' }}
//         >
//           Cancel
//         </button>
//       </div>

//       {/* {error && (
//         <div className={styles.error} style={{ marginBottom: '10px' }}>
//           {error}
//         </div>
//       )} */}

//       <div className={styles_local.profileCard}>
//         {renderStepIndicator()}

//         <form onSubmit={handleSubmit}>
//           {currentStep === 1 && renderStep1()}
//           {currentStep === 2 && renderStep2()}
//           {currentStep === 3 && renderStep3()}
//           {currentStep === 4 && renderStep4()}

//           {/* Navigation Buttons */}
//           <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             marginTop: '32px',
//             paddingTop: '24px',
//             borderTop: '1px solid #e5e7eb'
//           }}>
//             <button
//               type="button"
//               onClick={handlePrevious}
//               disabled={currentStep === 1}
//               className={styles.actionButton}
//               style={{
//                 background: currentStep === 1 ? '#e5e7eb' : '#6b7280',
//                 cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
//                 display: currentStep === 1 ? 'none' : 'block'
//               }}
//             >
//               Previous
//             </button>

//             {currentStep < totalSteps ? (
//               <button
//                 type="button"
//                 onClick={handleNext}
//                 className={styles.actionButton}
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 className={styles.actionButton}
//                 disabled={creating}
//               >
//                 {creating ? 'Creating Profile...' : 'Create Profile'}
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }