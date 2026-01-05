'use client'

import React, { useEffect, useState } from 'react'
import { fetchUsersAction, updateUserRoleAction, updateUserStatusAction } from '@/app/actions/users'
import styles from './dashboardViews.module.css'

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

const ROLE_ROTATION = ['customer', 'artist', 'staff', 'admin'] as const;
const STATUS_ROTATION = ['active', 'inactive', 'suspended', 'banned'] as const;

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

  // Función para obtener el siguiente rol
  const getNextRole = (currentRole: string): string => {
    const currentIndex = ROLE_ROTATION.indexOf(currentRole as any);
    const nextIndex = (currentIndex + 1) % ROLE_ROTATION.length;
    return ROLE_ROTATION[nextIndex];
  }

  // Función para obtener el siguiente status
  const getNextStatus = (currentStatus: string): string => {
    const currentIndex = STATUS_ROTATION.indexOf(currentStatus as any);
    const nextIndex = (currentIndex + 1) % STATUS_ROTATION.length;
    return STATUS_ROTATION[nextIndex];
  }

  // handler para cambiar el rol
  const handleRoleClick = async (userId: string, currentRole: string) => {
    const nextRole = getNextRole(currentRole);

    // Confirmación
    const confirmed = window.confirm(
      `Change role from "${currentRole}" to "${nextRole}"?`
    );

    if (!confirmed) return;

    try {
      // Actualizar estado local optimistamente
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: nextRole } : user
        )
      );

      // llamar a una acción del servidor para actualizar en la DB
      const result = await updateUserRoleAction(userId, nextRole);
      if (!result.success) throw new Error(result.error);

      console.log(`Updated user ${userId} role to ${nextRole}`);

    } catch (err) {
      console.error('Failed to update role:', err);
      // Revertir cambio en caso de error
      fetchUsers();
      alert('Failed to update role. Please try again.');
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


  const getRoleBadgeColor = (role: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981" // verde
      case "inactive":
        return "#6b7280" // gris
      case "suspended":
        return "#f59e0b" // naranja
      case "banned":
        return "#ef4444" // rojo
      default:
        return "#6b7280"
    }
  }

  // handler para cambiar el status
  const handleStatusClick = async (userId: string, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    
    const confirmed = window.confirm(
      `Change status from "${currentStatus}" to "${nextStatus}"?`
    );
    
    if (!confirmed) return;

    try {
      // Actualizar estado local optimistamente
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: nextStatus } : user
        )
      );

      const result = await updateUserStatusAction(userId, nextStatus);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      console.log(`Updated user ${userId} status to ${nextStatus}`);
      
    } catch (err) {
      console.error('Failed to update status:', err);
      fetchUsers();
      alert('Failed to update status. Please try again.');
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
                <th style={{ paddingLeft: '28px' }}>Role</th>
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
                      style={{
                        backgroundColor: getRoleBadgeColor(user.role), cursor: 'pointer',
                        transition: 'transform 0.2s, opacity 0.2s'
                      }}
                      onClick={() => {
                        if (user.role !== 'super_admin') {
                          handleRoleClick(user.id, user.role)
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.opacity = '1';
                      }}
                      title={`Click to change role (current: ${user.role})`}
                    >{user.role}</span>
                  </td>
                  <td
                     style={{ 
                        color: getStatusColor(user.status),
                        cursor: 'pointer',
                        // padding: '4px 12px',
                        // backgroundColor: `${getStatusColor(user.status)}15`,
                        display: 'inline-block',
                        transition: 'transform 0.2s, opacity 0.2s'
                      }}
                      onClick={() => handleStatusClick(user.id, user.status)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.opacity = '1';
                      }}
                      title={`Click to change status (current: ${user.status})`}
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
                    {/* <button
                      className={styles.actionButton}
                      onClick={() => console.log('Edit user:', user.id)}
                    >
                      Edit
                    </button> */}

                    {user.role !== 'super_admin' &&
                      <button
                        className={styles.actionButton}
                        onClick={() => console.log('Delete user:', user.id)}
                      >
                        Delete
                      </button>}
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