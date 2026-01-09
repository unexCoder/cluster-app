import React, { useState } from 'react'
import { FormField } from '../components/FormField'
import type { ArtistFormData, ValidationErrors } from '../../../../../../types/types'
import styles from './steps.module.css'

interface Step3Props {
    formData: ArtistFormData  // ✅ Use full form data
    validationErrors: ValidationErrors
    updateField: (field: string, value: any) => void
    clearFieldError: (field: string) => void
}


export const Step3socialLinks: React.FC<Step3Props> = ({
    formData,
    validationErrors,
    updateField,
    clearFieldError
}) => {
    const fieldClassName = 'infoGroup'

    return (
        <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Social Networks
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                How people can find you on network?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Two-column grid for names */}
                <div 
                    className={styles.innerFormContainer}
                >
                    <FormField
                        label="Website"
                        name="socialLinks.website"
                        value={formData.socialLinks.website}
                        onChange={updateField}
                        onFocus={clearFieldError}
                        placeholder="Website"
                        error={validationErrors['socialLinks.website']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Instagram"
                        name="socialLinks.instagram"
                        value={formData.socialLinks.instagram}
                        onChange={updateField}
                        onFocus={clearFieldError}
                        placeholder="Instagram"
                        error={validationErrors['socialLinks.instagram']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Facebook"
                        name="socialLinks.facebook"
                        value={formData.socialLinks.facebook}
                        onChange={updateField}
                        onFocus={clearFieldError}
                        placeholder="Facebook"
                        error={validationErrors['socialLinks.facebook']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Twitter"
                        name="socialLinks.twitter"
                        value={formData.socialLinks.twitter}
                        onChange={updateField}
                        onFocus={clearFieldError}
                        placeholder="Twitter"
                        error={validationErrors['socialLinks.twitter']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Spotify"
                        name="socialLinks.spotify"
                        value={formData.socialLinks.spotify}
                        onChange={updateField}
                        onFocus={clearFieldError}
                        placeholder="Spotify"
                        error={validationErrors['socialLinks.spotify']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Youtube"
                        name="socialLinks.youtube"
                        value={formData.socialLinks.youtube}
                        onChange={updateField}
                        onFocus={clearFieldError}
                        placeholder="Youtube"
                        error={validationErrors['socialLinks.youtube']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Tiktok"
                        name="socialLinks.tiktok"
                        value={formData.socialLinks.tiktok}
                        onChange={updateField}
                        onFocus={clearFieldError}
                        placeholder="Tiktok"
                        error={validationErrors['socialLinks.tiktok']}
                        className={fieldClassName}
                    />

                </div>
            </div>
        </div>
    )
}
