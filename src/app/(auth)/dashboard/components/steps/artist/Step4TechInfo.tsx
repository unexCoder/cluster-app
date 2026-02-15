import React, { useState } from 'react'
import { FormField } from '../../components/FormField'
import type { TechnicalInfo, ValidationErrors } from '../../../../../../../types/types'
import styles from '../steps.module.css'
import { techInfoSchema } from '@/lib/validations/artistProfile'
import { z } from 'zod'
import { PDFField } from '../../components/PDFField'
import { getPDFUploadUrl } from '@/app/actions/upload-file'
import { validatePDFFile } from '@/lib/s3-upload'

interface Step4Props {
    formData: TechnicalInfo
    validationErrors: ValidationErrors
    updateField: (field: string, value: any) => void
    clearFieldError: (field: string) => void
    setValidationError?: (field: string, error: string) => void
}

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
    // Separate state for each PDF field
    const [riderState, setRiderState] = useState({
        isUploading: false,
        error: ''
    })

    const [presskitState, setPresskitState] = useState({
        isUploading: false,
        error: ''
    })

    // Generic PDF upload handler
    const handlePDFUpload = async (
        file: File | null,
        fieldName: 'riderUrl' | 'presskitUrl',
        setState: React.Dispatch<React.SetStateAction<{ isUploading: boolean; error: string }>>
    ) => {
        if (!file) {
            updateField(fieldName, '')
            return
        }

        // Use centralized validation
        const validation = validatePDFFile(file)
        if (!validation.valid) {
            setState(prev => ({ ...prev, error: validation.error || 'Invalid file' }))
            return
        }

        setState({ isUploading: true, error: '' }) 

        try {
            const response = await getPDFUploadUrl(file.name, file.type)

            if (!response.success) {
                throw new Error(response.error || 'Failed to get upload URL')
            }

            const uploadResponse = await fetch(response.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            })

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload PDF')
            }

            updateField(fieldName, response.publicUrl)
            clearFieldError(fieldName)
            console.log(`✅ ${fieldName} uploaded successfully:`, response.publicUrl)
        } catch (error) {
            console.error('Upload error:', error)
            setState(prev => ({ 
                ...prev, 
                error: 'Failed to upload PDF. Please try again.' 
            }))
            updateField(fieldName, '')
        } finally {
            setState(prev => ({ ...prev, isUploading: false }))
        }
    }

    // Specific handlers for each field
    const handleRiderSelect = (file: File | null) => {
        handlePDFUpload(file, 'riderUrl', setRiderState)
    }

    const handlePresskitSelect = (file: File | null) => {
        handlePDFUpload(file, 'presskitUrl', setPresskitState)
    }

    // Validation logic
    const validateField = (fieldName: string, value: any) => {
        try {
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

    const handleFieldChange = (field: string, value: any) => {
        updateField(field, value)
        clearFieldError(field)
    }

    const handleFieldBlur = (field: string) => {
        let value: any

        switch (field) {
            case 'requirements':
                value = formData.requirements
                break
            case 'riderUrl':
                value = formData.riderUrl
                break
            case 'presskitUrl':
                value = formData.presskitUrl
                break
            default:
                return
        }

        validateField(field, value)
    }

    const fieldClassName = 'infoGroup'

    return (
        <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Technical Information
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '24px' }}>
                What are your technical requirements
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                    error={validationErrors['requirements']}
                    className={fieldClassName}
                    
                />

                {/* Tech Rider PDF Upload */}
                <div>
                    <PDFField
                        label="Tech Rider"
                        name="riderPDF"
                        onChange={handleRiderSelect}
                        required
                        maxSize={10 * 1024 * 1024}
                        isUploading={riderState.isUploading}
                        error={riderState.error}
                        currentFileUrl={formData.riderUrl}
                        helperText="Upload your technical rider document (PDF, max 10MB)"
                        className={fieldClassName}
                    />

                    {formData.riderUrl && !riderState.isUploading && (
                        <div style={{ 
                            marginTop: '8px',
                            padding: '8px 12px',
                            background: '#f0fdf4',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span style={{ fontSize: '14px' }}>✅</span>
                            <span style={{ fontSize: '14px', color: '#059669' }}>
                                Tech rider uploaded successfully
                            </span>
                        </div>
                    )}
                </div>

                {/* Press Kit PDF Upload */}
                <div>
                    <PDFField
                        label="Press Kit / Resume"
                        name="presskitPDF"
                        onChange={handlePresskitSelect}
                        maxSize={10 * 1024 * 1024}
                        isUploading={presskitState.isUploading}
                        error={presskitState.error}
                        currentFileUrl={formData.presskitUrl}
                        helperText="Upload your press kit or resume (PDF, max 10MB)"
                        className={fieldClassName}
                    />

                    {formData.presskitUrl && !presskitState.isUploading && (
                        <div style={{ 
                            marginTop: '8px',
                            padding: '8px 12px',
                            background: '#f0fdf4',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span style={{ fontSize: '14px' }}>✅</span>
                            <span style={{ fontSize: '14px', color: '#059669' }}>
                                Press kit uploaded successfully
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}