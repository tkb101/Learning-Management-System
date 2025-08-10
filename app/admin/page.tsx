'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
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
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>
  if (!user) return <div style={{ padding: '20px' }}>Redirecting...</div>

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Admin Panel</h1>
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              localStorage.clear()
              router.push('/login')
            }}
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* User Management */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>👥 User Management</h3>
          <p>Add, edit, and manage system users</p>
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={() => router.push('/admin/users/add')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px',
                marginBottom: '10px'
              }}
            >
              Add User
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              Manage Users
            </button>
          </div>
        </div>

        {/* Learning Path Management */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>📚 Learning Paths</h3>
          <p>Create and manage learning paths</p>
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={() => router.push('/admin/learning-paths/add')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px',
                marginBottom: '10px'
              }}
            >
              Create Path
            </button>
            <button
              onClick={() => router.push('/admin/learning-paths')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              Manage Paths
            </button>
          </div>
        </div>

        {/* Analytics */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>📊 System Analytics</h3>
          <p>View system-wide statistics</p>
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={() => router.push('/admin/analytics')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Enrollments */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>🎓 Enrollments</h3>
          <p>Manage user enrollments</p>
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={() => router.push('/admin/enrollments')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              View Enrollments
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '40px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3>Quick Stats</h3>
        <p>For detailed analytics, use the Analytics section above or API endpoints.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <strong>Total Users</strong><br/>
            <span style={{ fontSize: '24px', color: '#007bff' }}>API Call</span>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <strong>Learning Paths</strong><br/>
            <span style={{ fontSize: '24px', color: '#28a745' }}>API Call</span>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <strong>Active Enrollments</strong><br/>
            <span style={{ fontSize: '24px', color: '#ffc107' }}>API Call</span>
          </div>
        </div>
      </div>
    </div>
  )
}