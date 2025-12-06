'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Enrollment {
  id: string
  learningPathId: string
  learningPathTitle?: string
  enrolledAt: string
  status: string
  progress?: number
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchEnrollments()
    const interval = setInterval(fetchEnrollments, 3000)
    return () => clearInterval(interval)
  }, [router])

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/enrollments', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      
      // Handle different response formats
      let enrollments = []
      if (Array.isArray(data)) {
        enrollments = data
      } else if (data.enrollments && Array.isArray(data.enrollments)) {
        enrollments = data.enrollments
      } else if (data.data && Array.isArray(data.data)) {
        enrollments = data.data
      }
      
      // Map the response to match interface
      const mappedEnrollments = enrollments.map((e: any) => ({
        id: e.id,
        learningPathId: e.pathId,
        learningPathTitle: e.path?.title || 'Learning Path',
        enrolledAt: e.enrolledAt,
        status: e.isActive ? 'ACTIVE' : 'INACTIVE',
        progress: Math.round(e.progress || 0)
      }))
      
      setEnrollments(mappedEnrollments)
      setError(null)
    } catch (err) {
      setError('Failed to load enrollments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f7fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '2rem 5%'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: '#10b981',
            border: '2px solid #10b981',
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '2rem',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#10b981'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.color = '#10b981'
          }}
        >
          ← Back to Dashboard
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '2.5rem',
          borderRadius: '20px',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
            fontWeight: '700',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            📖 My Learning Journey
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.95', margin: '0.5rem 0 0 0' }}>
            Track your progress and continue where you left off
          </p>
        </div>

        {loading && (
          <div style={{ 
            textAlign: 'center',
            padding: '4rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="pulse" style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>Loading your enrollments...</p>
          </div>
        )}
        
        {error && (
          <div style={{
            padding: '1.5rem',
            background: '#fed7d7',
            color: '#c53030',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '500',
            border: '2px solid #fc8181'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {enrollments.length > 0 ? (
            enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(16, 185, 129, 0.2)'
                  e.currentTarget.style.borderColor = '#10b981'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                {/* Progress bar at top */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: '#e2e8f0'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${enrollment.progress || 0}%`,
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    📚
                  </div>
                  
                  <div style={{
                    background: enrollment.status === 'ACTIVE' ? '#d1fae5' : '#fef3c7',
                    color: enrollment.status === 'ACTIVE' ? '#065f46' : '#92400e',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {enrollment.status === 'ACTIVE' ? '✓ Active' : '⏸ Paused'}
                  </div>
                </div>

                <h3 style={{ 
                  margin: '0 0 0.75rem 0',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#2d3748',
                  lineHeight: '1.4'
                }}>
                  {enrollment.learningPathTitle || 'Learning Path'}
                </h3>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#718096',
                    fontSize: '0.9rem'
                  }}>
                    <span>📅</span>
                    <span>Started {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {enrollment.progress !== undefined && (
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '600' }}>
                        Course Progress
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                        {enrollment.progress}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${enrollment.progress}%`,
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        borderRadius: '10px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            !loading && (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '4rem',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                <h3 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                  No Enrollments Yet
                </h3>
                <p style={{ color: '#718096', marginBottom: '2rem', fontSize: '1.05rem' }}>
                  Start your learning journey today!
                </p>
                <button
                  onClick={() => router.push('/learning-paths-view')}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                    transition: 'transform 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Browse Learning Paths →
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
