'use client'

import React, { useEffect, useState } from 'react'
import { fetchUsersAction } from '@/app/actions/users'
import styles from './browseUsers.module.css'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  status: string
  created_at?: string
  last_login_at?: string
}

export default function BrowseUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchUsersAction()

      if (result.success) {
        setUsers(result.users)
      } else {
        throw new Error(result.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchUsers} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  
  const getRoleBadgeColor = (role:string) => {
    switch (role) {
      case "super_admin":
        return "#c30f45"
      case "admin":
        return "#c30f45"
      case "staff":
        return "#2563eb"
      case "artist":
        return "#2EC4B6"
      case "customer":
      default:
        return "#059669"
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Browse Users</h2>
        <button onClick={fetchUsers} className={styles.refreshButton}>
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className={styles.empty}>No users found</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Last name</th>
                <th>Email</th>
                <th style={{paddingLeft:'28px'}}>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Last Login At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span 
                      className={styles.roleBadge}
                      style={{ backgroundColor: getRoleBadgeColor(user.role)}}
                    >{user.role}</span>
                  </td>
                  <td
                     style={{ color: user.status === 'active' ? '#44ef44' : '#ef4444' }}
                  >{user.status}</td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => console.log('Edit user:', user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => console.log('Delete user:', user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}