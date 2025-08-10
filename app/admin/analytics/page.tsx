'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalPaths: number
    totalEnrollments: number
    activeEnrollments: number
    completedPaths: number
    completionRate: string
  }
  popularPaths: Array<{
    id: string
    title: string
    creator: string
    enrollmentCount: number
  }>
  engagement: Record<string, number>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [days, setDays] = useState(30)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    try {
      const user = JSON.parse(userData)
      if (user.role !== 'ADMIN' && user.role !== 'TEACHER') {
        router.push('/dashboard')
        return
      }
    } catch (error) {
      router.push('/login')
      return
    }

    fetchAnalytics()
  }, [router, days])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/analytics/overview?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        setError('Failed to fetch analytics')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading analytics...</div>

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
        <h1>System Analytics</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={() => router.push('/admin')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Admin
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {analytics && (
        <>
          {/* Overview Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Total Users</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
                {analytics.overview.totalUsers}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>Learning Paths</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                {analytics.overview.totalPaths}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>Total Enrollments</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
                {analytics.overview.totalEnrollments}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#17a2b8' }}>Active Enrollments</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8' }}>
                {analytics.overview.activeEnrollments}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>Completed Paths</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
                {analytics.overview.completedPaths}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#6f42c1' }}>Completion Rate</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6f42c1' }}>
                {analytics.overview.completionRate}%
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Popular Learning Paths */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#007bff' }}>Most Popular Learning Paths</h3>
              {analytics.popularPaths.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center' }}>No learning paths found</p>
              ) : (
                <div>
                  {analytics.popularPaths.map((path, index) => (
                    <div key={path.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: index < analytics.popularPaths.length - 1 ? '1px solid #eee' : 'none'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{path.title}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>by {path.creator}</div>
                      </div>
                      <div style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {path.enrollmentCount} enrollments
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Engagement Statistics */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#28a745' }}>User Engagement (Last {days} days)</h3>
              {Object.keys(analytics.engagement).length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center' }}>No engagement data found</p>
              ) : (
                <div>
                  {Object.entries(analytics.engagement).map(([action, count]) => (
                    <div key={action} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid #eee'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>
                        {action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#666' }}>
              For more detailed analytics and API access, use the API endpoints directly or integrate with your preferred analytics tools.
            </p>
          </div>
        </>
      )}
    </div>
  )
}