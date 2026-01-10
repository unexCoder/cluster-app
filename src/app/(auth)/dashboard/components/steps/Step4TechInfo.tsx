import React, { useState } from 'react'
import { FormField } from '../components/FormField'
import type { ArtistFormData, ValidationErrors } from '../../../../../../types/types'
import styles from './steps.module.css'
import { techInfoSchema } from '@/lib/validations/artistProfile'

interface Step4Props {
    formData: ArtistFormData  // ✅ Use full form data
    validationErrors: ValidationErrors
    updateField: (field: string, value: any) => void
    clearFieldError: (field: string) => void
}

export const Step4TechInfo: React.FC<Step4Props> = ({
    formData,
    validationErrors,
    updateField,
    clearFieldError
}) => {
    const fieldClassName = 'infoGroup'



    // TEST VALIDATORS 
    // Usage examples - VALID cases
    const validData1 = {
        technical_requirements: 'Need 2 microphones and a mixer',
        rider_url: '',
        presskit_url: 'https://example.com/presskit.pdf',
    };
    console.log(techInfoSchema.parse(validData1)); // ✓ Has technical_requirements

    const validData2 = {
        technical_requirements: '',
        rider_url: 'https://example.com/rider.pdf',
        presskit_url: '',
    };
    console.log(techInfoSchema.parse(validData2)); // ✓ Has rider_url

    const validData3 = {
        technical_requirements: 'Stage setup requirements...',
        rider_url: 'https://example.com/rider.pdf',
        presskit_url: 'https://example.com/presskit.pdf',
    };
    console.log(techInfoSchema.parse(validData3)); // ✓ Has both

    const validData4 = {
        technical_requirements: 'Some requirements',
        rider_url: '',
        presskit_url: '',
    };
    console.log(techInfoSchema.parse(validData4));
    // 


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
                        value={formData.technical.requirements}
                        required
                        rows={5}
                        onChange={updateField}
                        onFocus={() => clearFieldError('technical')}
                        placeholder="What you and your setup need for the show"
                        error={validationErrors['technical']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Tech Rider Url"
                        name="technical.riderUrl"
                        value={formData.technical.riderUrl}
                        required
                        onChange={updateField}
                        onFocus={() => clearFieldError('technical')}
                        placeholder="Tech Rider Url"
                        error={validationErrors['technical']}
                        className={fieldClassName}
                    />

                    <FormField
                        label="Presskit Url"
                        name="technical.presskitUrl"
                        value={formData.technical.presskitUrl}
                        onChange={updateField}
                        placeholder="Press kit Url"
                        className={fieldClassName}
                    />


                </div>
            </div>
        </div>
    )
}
