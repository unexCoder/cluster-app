import React from 'react'
import { FormField } from '../../components/FormField'
import type { SocialLinks, ValidationErrors } from '../../../../../../../types/types'
import styles from '../steps.module.css'
import { socialLinksSchema } from '@/lib/validations/artistProfile'
import { z } from 'zod'

interface Step3Props {
    formData: SocialLinks
    validationErrors: ValidationErrors
    updateField: (field: string, value: any) => void
    clearFieldError: (field: string) => void
    setValidationError?: (field: string, error: string) => void
}

// Map component field names (camelCase) to schema field names (snake_case)
const fieldNameMap: Record<string, keyof typeof socialLinksSchema.shape> = {
    website: 'website',
    instagram: 'instagram',
    facebook: 'facebook',
    tiktok: 'tiktok',
    spotify: 'spotify',
    twitter: 'twitter',
    youtube: 'youtube',
}

export const Step3socialLinks: React.FC<Step3Props> = ({
    formData,
    validationErrors,
    updateField,
    clearFieldError,
    setValidationError
}) => {

    // validation logic
    // Validate individual field
    const validateField = (fieldName: string, value: any) => {
        try {
            // Map camelCase field name to snake_case schema field
            const schemaFieldName = fieldNameMap[fieldName]
            if (!schemaFieldName) {
                console.warn(`No schema mapping found for field: ${fieldName}`)
                return false
            }

            const fieldSchema = socialLinksSchema.shape[schemaFieldName]
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
            case 'website':
                value = formData.website
                break
            case 'instagram':
                value = formData.instagram
                break
            case 'facebook':
                value = formData.facebook
                break
            case 'youtube':
                value = formData.youtube
                break
            case 'twitter':
                value = formData.twitter
                break
            case 'spotify':
                value = formData.spotify
                break
            case 'tiktok':
                value = formData.tiktok
                break
            default:
                return
        }

        validateField(field, value)
    }


    // style
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
                        value={formData.website}
                        onChange={handleFieldChange}
                        onFocus={clearFieldError}
                        onBlur={() => handleFieldBlur('website')}
                        placeholder="Website"
                        error={validationErrors['website']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Instagram"
                        name="socialLinks.instagram"
                        value={formData.instagram}
                        onChange={handleFieldChange}
                        onFocus={clearFieldError}
                        onBlur={() => handleFieldBlur('instagram')}
                        placeholder="@instagram"
                        error={validationErrors['instagram']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Facebook"
                        name="socialLinks.facebook"
                        value={formData.facebook}
                        onChange={handleFieldChange}
                        onFocus={clearFieldError}
                        onBlur={() => handleFieldBlur('facebook')}
                        placeholder="@facebook"
                        error={validationErrors['facebook']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Twitter"
                        name="socialLinks.twitter"
                        value={formData.twitter}
                        onChange={handleFieldChange}
                        onFocus={clearFieldError}
                        onBlur={() => handleFieldBlur('twitter')}
                        placeholder="@twitter"
                        error={validationErrors['twitter']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Spotify"
                        name="socialLinks.spotify"
                        value={formData.spotify}
                        onChange={handleFieldChange}
                        onFocus={clearFieldError}
                        onBlur={() => handleFieldBlur('spotify')}
                        placeholder="Spotify"
                        error={validationErrors['spotify']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Youtube"
                        name="socialLinks.youtube"
                        value={formData.youtube}
                        onChange={handleFieldChange}
                        onFocus={clearFieldError}
                        onBlur={() => handleFieldBlur('youtube')}
                        placeholder="@youtube"
                        error={validationErrors['youtube']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Tiktok"
                        name="socialLinks.tiktok"
                        value={formData.tiktok}
                        onChange={handleFieldChange}
                        onFocus={clearFieldError}
                        onBlur={() => handleFieldBlur('tiktok')}
                        placeholder="Tiktok"
                        error={validationErrors['tiktok']}
                        className={fieldClassName}
                    />

                </div>
            </div>
        </div>
    )
}
