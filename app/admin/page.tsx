'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AdminStats {
  totalUsers?: number
  totalLearningPaths?: number
  totalEnrollments?: number
  activeUsers?: number
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'ADMIN') {
        alert('Access denied. Admin only.')
        router.push('/dashboard')
        return
      }
      setUser(parsedUser)
      fetchAdminStats()
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/analytics/overview', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setStats({
        totalUsers: data.totalUsers || 0,
        totalLearningPaths: data.totalLearningPaths || 0,
        totalEnrollments: data.totalEnrollments || 0,
        activeUsers: data.activeUsers || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>
  if (!user) return <div style={{ padding: '20px' }}>Redirecting...</div>

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <div>
          <h1 style={{ marginTop: 0, marginBottom: '4px' }}>Admin Dashboard</h1>
          <p style={{ color: '#888', margin: 0 }}>System Management</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #e3f2fd'
        }}>
          <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>👥 Total Users</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', margin: 0 }}>
            {stats?.totalUsers || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #f3e5f5'
        }}>
          <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>📚 Learning Paths</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#6f42c1', margin: 0 }}>
            {stats?.totalLearningPaths || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #e8f5e9'
        }}>
          <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>🎓 Total Enrollments</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>
            {stats?.totalEnrollments || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #fff3e0'
        }}>
          <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>⚡ Active Users</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800', margin: 0 }}>
            {stats?.activeUsers || 0}
          </p>
        </div>
      </div>

      {/* Management Sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        {/* Users */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>👥 Users</h3>
          <p style={{ color: '#666', margin: '0 0 16px 0', fontSize: '14px' }}>Manage system users and roles</p>
          <button
            onClick={() => router.push('/admin/users/add')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}
          >
            Add User
          </button>
          <button
            onClick={() => router.push('/admin/users')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Manage Users
          </button>
        </div>

        {/* Learning Paths */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>� Learning Paths</h3>
          <p style={{ color: '#666', margin: '0 0 16px 0', fontSize: '14px' }}>Create and manage courses</p>
          <button
            onClick={() => router.push('/admin/learning-paths/add')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}
          >
            Create Path
          </button>
          <button
            onClick={() => router.push('/admin/learning-paths')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Manage Paths
          </button>
        </div>

        {/* Analytics */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>� Analytics</h3>
          <p style={{ color: '#666', margin: '0 0 16px 0', fontSize: '14px' }}>View system-wide insights</p>
          <button
            onClick={() => router.push('/admin/analytics')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}