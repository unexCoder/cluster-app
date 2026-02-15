import React from 'react'
import styles from './stepIndicator.module.css'

export interface Step {
  number: number
  label: string
}
const DEFAULT_STEPS: Step[] = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Contact' },
  { number: 3, label: 'Social Media' },
  { number: 4, label: 'Technical' }
]

interface StepIndicatorProps {
  currentStep: number
  steps?: Step[]
}


export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep,
  steps = DEFAULT_STEPS 
}) => (
  <div className={styles.stepIndicatorContainer}>
    {steps.map((step, index) => (
      <React.Fragment key={step.number}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: currentStep >= step.number ? '#3b82f6' : '#e5e7eb',
              color: currentStep >= step.number ? 'white' : '#6b7280',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            {step.number}
          </div>
          <span style={{
            fontSize: '12px',
            color: currentStep >= step.number ? '#3b82f6' : '#ffffff',
            fontWeight: currentStep === step.number ? '600' : '400'
          }}>
            {step.label}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div
            style={{
              // display:'none',
              flex: 1,
              height: '2px',
              margin: '0 12px',
              background: currentStep > step.number ? '#3b82f6' : '#e5e7eb'
            }}
          />
        )}
      </React.Fragment>
    ))}
  </div>
)