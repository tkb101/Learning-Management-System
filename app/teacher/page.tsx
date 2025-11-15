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
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <div>
          <h1 style={{ marginTop: 0, marginBottom: '4px' }}>Teacher Dashboard</h1>
          <p style={{ color: '#888', margin: 0 }}>Welcome, {user.name}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #e3f2fd'
        }}>
          <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>👥 Total Students</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', margin: 0 }}>
            {stats?.totalStudents || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #f3e5f5'
        }}>
          <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>📚 My Courses</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#6f42c1', margin: 0 }}>
            {stats?.totalCourses || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #e8f5e9'
        }}>
          <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>🎯 Active Enrollments</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>
            {stats?.activeEnrollments || 0}
          </p>
        </div>
      </div>

      {/* Courses Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Your Courses</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                style={{
                  padding: '12px',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div>
                  <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>{course.title}</p>
                  <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
                    {course.studentsEnrolled || 0} students enrolled
                  </p>
                </div>
                <span style={{
                  backgroundColor: '#e3f2fd',
                  color: '#007bff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {course.status || 'Active'}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No courses created yet.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={() => router.push('/admin/learning-paths/add')}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Create Course
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )
}
