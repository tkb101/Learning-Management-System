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
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <div className="pulse" style={{ fontSize: '1.2rem' }}>Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'initial',
            WebkitTextFillColor: 'initial'
          }}>📚</span>
          EduPlatform
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600', color: '#2d3748' }}>{user.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#718096' }}>
              {user.role === 'ADMIN' ? '👑 Admin' : user.role === 'TEACHER' ? '👨‍🏫 Teacher' : '🎓 Student'}
            </div>
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
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '3rem',
          borderRadius: '20px',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Welcome back, {user.name}! 👋
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.95' }}>
            Ready to continue your learning journey?
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {user.interests.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                💡 {user.interests.slice(0, 3).join(', ')}
              </div>
            )}
            {user.skills.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                ⚡ {user.skills.slice(0, 3).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          
          {user.role !== 'ADMIN' && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
            onClick={() => router.push('/learning-paths-view')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(102, 126, 234, 0.2)'
              e.currentTarget.style.borderColor = '#667eea'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.borderColor = 'transparent'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                🎯
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#2d3748' }}>
                Learning Paths
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Browse and enroll in personalized learning paths
              </p>
              <div style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Explore Courses →
              </div>
            </div>
          )}

          {user.role === 'STUDENT' && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
            onClick={() => router.push('/enrollments-view')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(16, 185, 129, 0.2)'
              e.currentTarget.style.borderColor = '#10b981'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.borderColor = 'transparent'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                background: '#10b981',
                borderRadius: '12px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                📖
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#2d3748' }}>
                My Enrollments
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Track your progress and continue learning
              </p>
              <div style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                View Progress →
              </div>
            </div>
          )}

          {user.role !== 'ADMIN' && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
            onClick={() => router.push('/analytics-view')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(59, 130, 246, 0.2)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.borderColor = 'transparent'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                background: '#3b82f6',
                borderRadius: '12px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                📊
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#2d3748' }}>
                Analytics
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                View detailed insights and performance metrics
              </p>
              <div style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                View Analytics →
              </div>
            </div>
          )}

          {user.role === 'STUDENT' && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
            onClick={() => router.push('/recommendations-view')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(245, 158, 11, 0.2)'
              e.currentTarget.style.borderColor = '#f59e0b'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.borderColor = 'transparent'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                background: '#f59e0b',
                borderRadius: '12px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                ✨
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#2d3748' }}>
                Recommendations
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                AI-powered personalized course suggestions
              </p>
              <div style={{
                padding: '0.75rem 1.5rem',
                background: '#f59e0b',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Get Suggestions →
              </div>
            </div>
          )}

          {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
            onClick={() => router.push('/teacher')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(139, 92, 246, 0.2)'
              e.currentTarget.style.borderColor = '#8b5cf6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.borderColor = 'transparent'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                background: '#8b5cf6',
                borderRadius: '12px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                👨‍🏫
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#2d3748' }}>
                Teacher Dashboard
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Manage courses, students, and content
              </p>
              <div style={{
                padding: '0.75rem 1.5rem',
                background: '#8b5cf6',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Manage Content →
              </div>
            </div>
          )}

          {user.role === 'ADMIN' && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
            onClick={() => router.push('/admin')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(239, 68, 68, 0.2)'
              e.currentTarget.style.borderColor = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.borderColor = 'transparent'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                background: '#ef4444',
                borderRadius: '12px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                👑
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#2d3748' }}>
                Admin Panel
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Full system access and user management
              </p>
              <div style={{
                padding: '0.75rem 1.5rem',
                background: '#ef4444',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Manage System →
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
