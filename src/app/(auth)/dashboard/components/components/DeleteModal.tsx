import React from 'react'

interface DeleteModalProps {
    onConfirm: () => void
    onCancel: () => void
    deleting: boolean
    title?: string
    message?: string
}

export default function DeleteModal({  
    onConfirm, 
    onCancel, 
    deleting,
    title = "Delete Artist Profile",
    message = "Are you sure you want to delete this artist profile? This action cannot be undone."
}: DeleteModalProps) {

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
            onClick={onCancel} // Changed: use onCancel prop instead of local state
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '400px',
                    width: '90%',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                    {title}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onCancel} // Changed: use onCancel prop
                        disabled={deleting}
                        style={{
                            padding: '10px 24px',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: deleting ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm} // Changed: use onConfirm prop
                        disabled={deleting}
                        style={{
                            padding: '10px 24px',
                            background: deleting ? '#fca5a5' : '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: deleting ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {deleting ? 'Deleting...' : 'Delete Profile'}
                    </button>
                </div>
            </div>
        </div>
    )
}