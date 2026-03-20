// src/app/(protected)/profile/create/components/FileField.tsx
import React, { useRef } from 'react'

interface FileFieldProps {
  label: string
  name: string
  accept?: string
  onChange: (file: File | null) => void
  onFocus?: (name: string) => void
  required?: boolean
  maxSize?: number // in bytes
  isUploading?: boolean
  error?: string
  className?: string
  helperText?: string
}

export const ImageField: React.FC<FileFieldProps> = ({
  label,
  name,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  onChange,
  onFocus,
  required = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  isUploading = false,
  error,
  className = '',
  helperText = 'JPG, PNG, or WebP (max 5MB)'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      onChange(null)
      return
    }

    onChange(file)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={className}>
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
      </label>
      
      <div style={{ flex: 1 }}>
        <input
          ref={fileInputRef}
          id={name}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          onFocus={() => onFocus?.(name)}
          disabled={isUploading}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            opacity: isUploading ? 0.6 : 1,
          }}
        />
        
        {helperText && (
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            {helperText}
          </p>
        )}
        
        {isUploading && (
          <div style={{ 
            color: '#3b82f6', 
            fontSize: '14px', 
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⏳</span>
            <span>Uploading image...</span>
          </div>
        )}
      </div>

      {error && (
        <span style={{ 
          color: '#ef4444', 
          fontSize: '12px', 
          marginTop: '4px', 
          display: 'block' 
        }}>
          {error}
        </span>
      )}
    </div>
  )
}