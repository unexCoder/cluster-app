import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  onFocus?: (name: string) => void
  onBlur?: (field: string, value: any) => void
  type?: string
  required?: boolean
  placeholder?: string
  rows?: number
  error?: string
  className?: string
  min?:number
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onFocus,
  type = 'text',
  required = false,
  placeholder,
  rows,
  error,
  className = '',
  min
}) => {
  const isTextarea = rows && rows > 1

  return (
    <div className={className}>
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
      </label>
      {isTextarea ? (
        <textarea
          id={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onFocus={() => onFocus?.(name)}
          rows={rows}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      ) : (
        <input
          id={name}
          type={type}
          min={min}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onFocus={() => onFocus?.(name)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      )}
      {error && (
        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}