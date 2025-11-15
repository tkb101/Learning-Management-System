'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  interests: string[]
  skills: string[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  if (!user) {
    return <div style={{ padding: '20px' }}>Redirecting to login...</div>
  }

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>LMS Dashboard</h1>
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

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2>Welcome, {user.name}!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Interests:</strong> {user.interests.join(', ') || 'None specified'}</p>
        <p><strong>Skills:</strong> {user.skills.join(', ') || 'None specified'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        {/* Learning Paths - Show for students only */}
        {user.role !== 'ADMIN' && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3>Learning Paths</h3>
            <p>Browse and enroll in learning paths</p>
            <button
              onClick={() => router.push('/learning-paths-view')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View
            </button>
          </div>
        )}

        {/* Enrollments - Show for students only */}
        {user.role !== 'ADMIN' && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3>My Enrollments</h3>
            <p>Track your learning progress</p>
            <button
              onClick={() => router.push('/enrollments-view')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View
            </button>
          </div>
        )}

        {/* Analytics - Show for students only */}
        {user.role !== 'ADMIN' && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3>Analytics</h3>
            <p>View your learning analytics</p>
            <button
              onClick={() => router.push('/analytics-view')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View
            </button>
          </div>
        )}

        {/* Recommendations - Show for students only */}
        {user.role !== 'ADMIN' && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3>Recommendations</h3>
            <p>Get personalized learning suggestions</p>
            <button
              onClick={() => router.push('/recommendations-view')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View
            </button>
          </div>
        )}

        {/* Teacher Panel */}
        {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3>Teacher Dashboard</h3>
            <p>Manage courses and students</p>
            <button
              onClick={() => router.push('/teacher')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Teacher Panel
            </button>
          </div>
        )}

        {/* Admin Panel */}
        {user.role === 'ADMIN' && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3>Admin Panel</h3>
            <p>Manage system and users</p>
            <button
              onClick={() => router.push('/admin')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Admin Panel
            </button>
          </div>
        )}
      </div>

      {/* <div style={{ marginTop: '40px' }}>
        <h3>API Testing</h3>
        <p>Use tools like Postman or curl to test the API endpoints. Remember to include the Authorization header:</p>
        <code style={{
          backgroundColor: '#f8f9fa',
          padding: '10px',
          display: 'block',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          Authorization: Bearer {localStorage.getItem('token')?.substring(0, 20)}...
        </code>
      </div> */}
    </div>
  )
}