import React from 'react'
import { FormField } from '../components/FormField'
import type { TechnicalInfo, ValidationErrors } from '../../../../../../types/types'
import styles from './steps.module.css'
import { techInfoSchema } from '@/lib/validations/artistProfile'
import { z } from 'zod'


interface Step4Props {
    formData: TechnicalInfo
    validationErrors: ValidationErrors
    updateField: (field: string, value: any) => void
    clearFieldError: (field: string) => void
    setValidationError?: (field: string, error: string) => void
}

// Map component field names (camelCase) to schema field names (snake_case)
const fieldNameMap: Record<string, keyof typeof techInfoSchema.shape> = {
    requirements: 'technical_requirements',
    riderUrl: 'rider_url',
    presskitUrl: 'presskit_url'
}

export const Step4TechInfo: React.FC<Step4Props> = ({
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

            const fieldSchema = techInfoSchema.shape[schemaFieldName]
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
            case 'requirements':
                value = formData.requirements
                break
            case 'rider_url':
                value = formData.riderUrl
                break
            case 'presskit_url':
                value = formData.presskitUrl
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
                Technical Information
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                What are your technical requirements
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Two-column grid for names */}
                <div className={styles.innerFormContainer}>
                    <FormField
                        label="Technical Requirements"
                        name="technical.requirements"
                        value={formData.requirements}
                        required
                        rows={5}
                        onChange={handleFieldChange}
                        onFocus={() => clearFieldError('requirements')}
                        onBlur={() => handleFieldBlur('requirements')}
                        placeholder="What you and your setup need for the show"
                        error={validationErrors['technical_requirements']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Tech Rider Url"
                        name="technical.riderUrl"
                        value={formData.riderUrl}
                        required
                        onChange={handleFieldChange}
                        onFocus={() => clearFieldError('rider_url')}
                        onBlur={() => handleFieldBlur('rider_url')}
                        placeholder="Tech Rider Url"
                        error={validationErrors['rider_url']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Presskit Url"
                        name="technical.presskitUrl"
                        value={formData.presskitUrl}
                        onChange={handleFieldChange}
                        onFocus={() => clearFieldError('presskit_url')}
                        onBlur={() => handleFieldBlur('presskit_url')}
                        placeholder="Press kit Url"
                        error={validationErrors['presskit_url']}
                        className={fieldClassName}
                    />

                </div>
            </div>
        </div>
    )
}
