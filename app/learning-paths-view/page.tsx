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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <button
        onClick={() => router.back()}
        style={{
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ← Back
      </button>

      <h1>Explore Learning Path</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

      {path && (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          maxWidth: '500px'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '12px' }}>{path.title}</h2>
          <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>{path.description}</p>

          <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '6px', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>
              <p style={{ margin: '8px 0' }}><strong>📊 Level:</strong> <span style={{ textTransform: 'capitalize' }}>{path.skillLevel || 'Not specified'}</span></p>
              {path.interests && path.interests.length > 0 && (
                <p style={{ margin: '8px 0' }}><strong>🎯 Interests:</strong> {path.interests.join(', ')}</p>
              )}
              {path.skills && path.skills.length > 0 && (
                <p style={{ margin: '8px 0' }}><strong>🛠️ Skills:</strong> {path.skills.join(', ')}</p>
              )}
            </div>
          </div>

          {enrollmentMessage && (
            <div style={{
              padding: '12px',
              backgroundColor: enrollmentMessage.type === 'success' ? '#d4edda' : '#f8d7da',
              color: enrollmentMessage.type === 'success' ? '#155724' : '#721c24',
              borderRadius: '4px',
              marginBottom: '16px',
              border: `1px solid ${enrollmentMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {enrollmentMessage.text}
            </div>
          )}

          <button
            onClick={handleEnroll}
            disabled={enrolling}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: enrolling ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: enrolling ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
      )}

      {!loading && !path && !error && (
        <p>No learning paths available</p>
      )}
    </div>
  )
}
