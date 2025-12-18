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

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2rem', color: '#8b5cf6' }}>Loading...</div>
  if (!user) return <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2rem', color: '#8b5cf6' }}>Redirecting...</div>

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            WebkitBackgroundClip: 'initial',
            WebkitTextFillColor: 'initial'
          }}>🛡️</span>
          Admin Dashboard
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            onClick={() => router.push('/profile')}
            style={{ 
              textAlign: 'right',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ fontWeight: '600', color: '#2d3748' }}>{user.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#718096' }}>Administrator</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#fed7d7',
              color: '#c53030',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fc8181'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fed7d7'
              e.currentTarget.style.color = '#c53030'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          padding: '2.5rem',
          borderRadius: '20px',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)'
        }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '0.5rem', margin: 0 }}>
            Welcome, {user.name}! 👋
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.95', margin: '0.5rem 0 0 0' }}>
            Full control over your learning management system
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '2px solid #3b82f630',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Total Users</p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', margin: 0 }}>
              {stats?.totalUsers || 0}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '2px solid #8b5cf630',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
            <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Learning Paths</p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6', margin: 0 }}>
              {stats?.totalLearningPaths || 0}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '2px solid #10b98130',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
            <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Total Enrollments</p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', margin: 0 }}>
              {stats?.totalEnrollments || 0}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '2px solid #f59e0b30',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Active Users</p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', margin: 0 }}>
              {stats?.activeUsers || 0}
            </p>
          </div>
        </div>

        {/* Management Sections */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Users */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '2px solid #e2e8f0',
            transition: 'transform 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👥</div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.4rem', color: '#2d3748' }}>Users</h3>
            <p style={{ color: '#718096', margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>Manage system users and roles</p>
            <button
              onClick={() => router.push('/admin/users/add')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ➕ Add User
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'white',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3b82f6'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.color = '#3b82f6'
              }}
            >
              📋 Manage Users
            </button>
          </div>

          {/* Learning Paths */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '2px solid #e2e8f0',
            transition: 'transform 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📚</div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.4rem', color: '#2d3748' }}>Learning Paths</h3>
            <p style={{ color: '#718096', margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>Create and manage courses</p>
            <button
              onClick={() => router.push('/admin/learning-paths/add')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ➕ Create Path
            </button>
            <button
              onClick={() => router.push('/admin/learning-paths')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'white',
                color: '#8b5cf6',
                border: '2px solid #8b5cf6',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8b5cf6'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.color = '#8b5cf6'
              }}
            >
              📋 Manage Paths
            </button>
          </div>

          {/* Analytics */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '2px solid #e2e8f0',
            transition: 'transform 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.4rem', color: '#2d3748' }}>Analytics</h3>
            <p style={{ color: '#718096', margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>View system-wide insights</p>
            <button
              onClick={() => router.push('/admin/analytics')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              📈 View Analytics
            </button>
          </div>
        </div>

        {/* Quick Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            display: 'block',
            padding: '1rem',
            background: 'white',
            color: '#718096',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '1rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ef4444'
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.color = '#718096'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )
}