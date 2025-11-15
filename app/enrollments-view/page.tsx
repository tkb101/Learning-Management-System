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

      <h1>My Enrollments</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        {enrollments.length > 0 ? (
          enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              style={{
                backgroundColor: 'white',
                padding: '16px',
                border: '1px solid #dee2e6',
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{enrollment.learningPathTitle || 'Learning Path'}</h3>
                  <p style={{ color: '#888', margin: '4px 0' }}>
                    <strong>📅 Enrolled:</strong> {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                  <p style={{ color: '#888', margin: '4px 0' }}>
                    <strong>📍 Status:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: enrollment.status === 'ACTIVE' ? '#28a745' : '#ffc107' }}>{enrollment.status}</span>
                  </p>
                </div>
                {enrollment.progress !== undefined && (
                  <div style={{ marginLeft: '20px', textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                      {enrollment.progress}%
                    </div>
                    <p style={{ margin: '4px 0', color: '#888', fontSize: '14px' }}>Progress</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: '#666', marginBottom: '16px' }}>No enrollments yet. Start learning today!</p>
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
                Browse Learning Paths
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}
