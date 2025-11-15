'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AnalyticsData {
  totalEnrollments?: number
  completedPaths?: number
  inProgressPaths?: number
  averageProgress?: number
  lastActivityDate?: string
  coursesCompleted?: number
  hoursSpent?: number
  [key: string]: any
}

const SimplePieChart = ({ completed, inProgress, total }: { completed: number; inProgress: number; total: number }) => {
  const completedPercent = total > 0 ? (completed / total) * 100 : 0
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
      <div style={{
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `conic-gradient(#28a745 0% ${completedPercent}%, #ffc107 ${completedPercent}% ${completedPercent + inProgressPercent}%, #e9ecef ${completedPercent + inProgressPercent}% 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{total}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>Total Enrolled</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#28a745', borderRadius: '2px' }}></div>
          <span style={{ color: '#333' }}>Completed: {completed} ({completedPercent.toFixed(0)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#ffc107', borderRadius: '2px' }}></div>
          <span style={{ color: '#333' }}>In Progress: {inProgress} ({inProgressPercent.toFixed(0)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#e9ecef', borderRadius: '2px' }}></div>
          <span style={{ color: '#888' }}>Not Started: {total - completed - inProgress}</span>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchAnalytics()
  }, [router])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/analytics/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      
      // Extract summary data
      const summary = data.summary || data
      setAnalytics({
        totalEnrollments: summary.totalEnrollments || 0,
        completedPaths: summary.completedPaths || 0,
        inProgressPaths: summary.activeEnrollments || 0,
        averageProgress: summary.completionRate || 0,
        hoursSpent: summary.totalTimeSpent || 0
      })
      setError(null)
    } catch (err) {
      setError('Failed to load analytics')
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

      <h1>Your Analytics</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

      {analytics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '20px' }}>
          {/* Pie Chart Section */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Enrollment Status</h2>
            <SimplePieChart 
              completed={analytics.completedPaths || 0}
              inProgress={analytics.inProgressPaths || 0}
              total={analytics.totalEnrollments || 0}
            />
          </div>

          {/* Other Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {analytics.averageProgress !== undefined && (
              <div style={{ backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>Avg Progress</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', margin: 0 }}>{Math.round(analytics.averageProgress)}%</p>
              </div>
            )}

            {analytics.hoursSpent !== undefined && (
              <div style={{ backgroundColor: '#fff5f5', padding: '16px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>Hours Spent</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545', margin: 0 }}>{analytics.hoursSpent}</p>
              </div>
            )}

            {analytics.lastActivityDate && (
              <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>Last Activity</p>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: 0 }}>
                  {new Date(analytics.lastActivityDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
