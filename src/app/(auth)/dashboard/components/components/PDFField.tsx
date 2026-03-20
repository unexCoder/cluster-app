// src/app/(protected)/profile/create/components/PDFField.tsx
import React, { useRef } from 'react'

interface PDFFieldProps {
  label: string
  name: string
  onChange: (file: File | null) => void
  onFocus?: (name: string) => void
  required?: boolean
  maxSize?: number // in bytes
  isUploading?: boolean
  error?: string
  className?: string
  helperText?: string
  currentFileUrl?: string // Display current uploaded PDF
}

export const PDFField: React.FC<PDFFieldProps> = ({
  label,
  name,
  onChange,
  onFocus,
  required = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  isUploading = false,
  error,
  className = '',
  helperText = 'PDF only (max 10MB)',
  currentFileUrl
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

  const getFileName = (url: string): string => {
    try {
      return decodeURIComponent(url.split('/').pop() || 'document.pdf')
    } catch {
      return 'document.pdf'
    }
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
          accept="application/pdf"
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
        
        {/* Current File Display */}
        {currentFileUrl && !isUploading && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: '#f3f4f6',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ color: '#ef4444', flexShrink: 0 }}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <a 
              href={currentFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {getFileName(currentFileUrl)}
            </a>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>
              (View)
            </span>
          </div>
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
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Uploading PDF...</span>
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

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}