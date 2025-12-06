'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TeacherStats {
  totalStudents?: number
  totalCourses?: number
  activeEnrollments?: number
}

interface Course {
  id: string
  title: string
  studentsEnrolled?: number
  status?: string
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
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
      if (parsedUser.role !== 'TEACHER' && parsedUser.role !== 'ADMIN') {
        alert('Access denied. Teachers and Admins only.')
        router.push('/dashboard')
        return
      }
      setUser(parsedUser)
      fetchTeacherData()
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch analytics overview for teacher
      const response = await fetch('/api/analytics/overview', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      
      setStats({
        totalStudents: data.totalUsers || 0,
        totalCourses: data.totalLearningPaths || 0,
        activeEnrollments: data.totalEnrollments || 0
      })

      // Fetch learning paths as courses
      const coursesResponse = await fetch('/api/learning-paths', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const coursesData = await coursesResponse.json()
      setCourses(Array.isArray(coursesData) ? coursesData.slice(0, 5) : coursesData.data?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error fetching teacher data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  if (!user) {
    return <div style={{ padding: '20px' }}>Redirecting...</div>
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
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'initial',
            WebkitTextFillColor: 'initial'
          }}>👨‍🏫</span>
          Teacher Portal
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600', color: '#2d3748' }}>{user.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#718096' }}>Educator</div>
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
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          padding: '2.5rem',
          borderRadius: '20px',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
        }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '0.5rem', margin: 0 }}>
            Welcome, {user.name}! 👋
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.95', margin: '0.5rem 0 0 0' }}>
            Manage your courses and track student progress
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
            <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Total Students</p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', margin: 0 }}>
              {stats?.totalStudents || 0}
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
            <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>My Courses</p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6', margin: 0 }}>
              {stats?.totalCourses || 0}
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <p style={{ color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Active Enrollments</p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', margin: 0 }}>
              {stats?.activeEnrollments || 0}
            </p>
          </div>
        </div>

        {/* Courses Section */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem', color: '#2d3748' }}>Your Courses</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course.id}
                  style={{
                    padding: '1.5rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f7fafc',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8b5cf6'
                    e.currentTarget.style.background = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.background = '#f7fafc'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      📖
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#2d3748' }}>{course.title}</p>
                      <p style={{ color: '#718096', margin: 0, fontSize: '0.9rem' }}>
                        {course.studentsEnrolled || 0} students enrolled
                      </p>
                    </div>
                  </div>
                  <span style={{
                    background: '#d1fae5',
                    color: '#065f46',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '700'
                  }}>
                    ✓ {course.status || 'Active'}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📚</div>
                <p>No courses created yet. Start by creating your first course!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/admin/learning-paths/add')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ➕ Create New Course
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1.25rem',
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
              e.currentTarget.style.borderColor = '#8b5cf6'
              e.currentTarget.style.color = '#8b5cf6'
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
    </div>
  )
}
