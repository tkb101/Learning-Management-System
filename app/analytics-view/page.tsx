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
            color: '#3b82f6',
            border: '2px solid #3b82f6',
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '2rem',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.3s'
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
          ← Back to Dashboard
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          padding: '2.5rem',
          borderRadius: '20px',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
            fontWeight: '700',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            📊 Your Analytics
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.95', margin: '0.5rem 0 0 0' }}>
            Track your learning progress and achievements
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
            <div className="pulse" style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>Loading analytics...</p>
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

        {analytics && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ 
              background: 'white', 
              padding: '2.5rem', 
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '2rem', textAlign: 'center', fontSize: '1.75rem', color: '#2d3748' }}>📈 Enrollment Overview</h2>
              <SimplePieChart 
                completed={analytics.completedPaths || 0}
                inProgress={analytics.inProgressPaths || 0}
                total={analytics.totalEnrollments || 0}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {analytics.averageProgress !== undefined && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #3b82f615 0%, #2563eb15 100%)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '2px solid #3b82f630',
                  transition: 'transform 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                  <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Average Progress</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', margin: 0 }}>{Math.round(analytics.averageProgress)}%</p>
                </div>
              )}

              {analytics.hoursSpent !== undefined && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #8b5cf615 0%, #7c3aed15 100%)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '2px solid #8b5cf630',
                  transition: 'transform 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
                  <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Hours Spent Learning</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6', margin: 0 }}>{analytics.hoursSpent}</p>
                </div>
              )}

              {analytics.lastActivityDate && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #10b98115 0%, #05966915 100%)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '2px solid #10b98130',
                  transition: 'transform 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                  <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Last Activity</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981', margin: 0 }}>
                    {new Date(analytics.lastActivityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
