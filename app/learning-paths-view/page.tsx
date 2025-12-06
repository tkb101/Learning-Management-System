'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LearningPath {
  id: string
  title: string
  description?: string
  skillLevel?: string
  interests?: string[]
  skills?: string[]
  isActive?: boolean
}

export default function LearningPathsPage() {
  const [path, setPath] = useState<LearningPath | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState(false)
  const [enrollmentMessage, setEnrollmentMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchPath()
  }, [router])

  const fetchPath = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/learning-paths', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched data:', data)
      
      // Handle different response formats
      let paths = []
      if (Array.isArray(data)) {
        paths = data
      } else if (data.paths && Array.isArray(data.paths)) {
        paths = data.paths
      } else if (data.data && Array.isArray(data.data)) {
        paths = data.data
      }
      
      if (paths.length > 0) {
        setPath(paths[0])
      } else {
        setError('No learning paths available')
      }
    } catch (err) {
      setError('Failed to load learning paths')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!path) return

    setEnrolling(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ learningPathId: path.id })
      })

      if (response.ok) {
        setEnrollmentMessage({ type: 'success', text: `Successfully enrolled in ${path.title}!` })
        setTimeout(() => {
          router.push('/enrollments-view')
        }, 1500)
      } else {
        setEnrollmentMessage({ type: 'error', text: 'Failed to enroll. Please try again.' })
      }
    } catch (err) {
      setEnrollmentMessage({ type: 'error', text: 'Error enrolling. Please try again.' })
      console.error(err)
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f7fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '2rem 5%'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: '#667eea',
            border: '2px solid #667eea',
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
            e.currentTarget.style.background = '#667eea'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.color = '#667eea'
          }}
        >
          ← Back to Dashboard
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2.5rem',
          borderRadius: '20px',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
            fontWeight: '700',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            🎯 Explore Learning Paths
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.95', margin: '0.5rem 0 0 0' }}>
            Discover courses tailored to your interests and skill level
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
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>Loading courses...</p>
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

        {path && (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                📖
              </div>
              <h2 style={{ 
                margin: 0,
                fontSize: '2rem',
                fontWeight: '700',
                color: '#2d3748'
              }}>
                {path.title}
              </h2>
            </div>

            <p style={{ 
              color: '#718096', 
              marginBottom: '2rem', 
              lineHeight: '1.8',
              fontSize: '1.05rem'
            }}>
              {path.description}
            </p>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '2px solid #667eea30'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
                <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '0.25rem' }}>Skill Level</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2d3748', textTransform: 'capitalize' }}>
                  {path.skillLevel || 'All Levels'}
                </div>
              </div>

              {path.interests && path.interests.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, #10b98115 0%, #059b6915 100%)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '2px solid #10b98130'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
                  <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '0.25rem' }}>Interests</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d3748' }}>
                    {path.interests.slice(0, 2).join(', ')}
                  </div>
                </div>
              )}
            </div>

            {path.skills && path.skills.length > 0 && (
              <div style={{
                background: '#f7fafc',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem'
              }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600', 
                  color: '#4a5568',
                  marginBottom: '0.75rem'
                }}>
                  🛠️ Skills You'll Learn
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {path.skills.map((skill, idx) => (
                    <span key={idx} style={{
                      background: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      color: '#667eea',
                      fontWeight: '500',
                      border: '1px solid #e2e8f0'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {enrollmentMessage && (
              <div style={{
                padding: '1rem',
                background: enrollmentMessage.type === 'success' ? '#c6f6d5' : '#fed7d7',
                color: enrollmentMessage.type === 'success' ? '#22543d' : '#c53030',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                border: `2px solid ${enrollmentMessage.type === 'success' ? '#9ae6b4' : '#fc8181'}`,
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                {enrollmentMessage.type === 'success' ? '✅' : '⚠️'} {enrollmentMessage.text}
              </div>
            )}

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              style={{
                width: '100%',
                padding: '1.25rem',
                background: enrolling ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: enrolling ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: '700',
                boxShadow: enrolling ? 'none' : '0 6px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (!enrolling) e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {enrolling ? '⏳ Enrolling...' : '🚀 Enroll in This Course'}
            </button>
          </div>
        )}

        {!loading && !path && !error && (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>No learning paths available at the moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
