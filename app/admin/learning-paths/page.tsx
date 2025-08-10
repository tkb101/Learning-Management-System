'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LearningPath {
  id: string
  title: string
  description: string
  skillLevel: string
  interests: string[]
  skills: string[]
  isActive: boolean
  createdAt: string
  creator: {
    name: string
    email: string
  }
  enrollmentCount: number
  modules: {
    id: string
    title: string
  }[]
}

export default function ManageLearningPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [skillLevelFilter, setSkillLevelFilter] = useState('ALL')
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

    fetchLearningPaths()
  }, [router])

  const fetchLearningPaths = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/learning-paths', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPaths(data.paths || [])
      } else {
        setError('Failed to fetch learning paths')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const togglePathStatus = async (pathId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/learning-paths/${pathId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (response.ok) {
        fetchLearningPaths() // Refresh the list
      } else {
        alert('Failed to update learning path status')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const filteredPaths = paths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkillLevel = skillLevelFilter === 'ALL' || path.skillLevel === skillLevelFilter
    return matchesSearch && matchesSkillLevel
  })

  if (loading) return <div style={{ padding: '20px' }}>Loading learning paths...</div>

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Manage Learning Paths</h1>
        <div>
          <button
            onClick={() => router.push('/admin/learning-paths/add')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Create Path
          </button>
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

      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by title, description, or creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        <div>
          <select
            value={skillLevelFilter}
            onChange={(e) => setSkillLevelFilter(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
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

      {/* Learning Paths Grid */}
      {filteredPaths.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          textAlign: 'center',
          color: '#666',
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}>
          {paths.length === 0 ? 'No learning paths found. Create some learning paths first.' : 'No learning paths match your search criteria.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
          {filteredPaths.map((path) => (
            <div key={path.id} style={{
              backgroundColor: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#007bff' }}>{path.title}</h3>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: 
                      path.skillLevel === 'BEGINNER' ? '#28a745' :
                      path.skillLevel === 'INTERMEDIATE' ? '#ffc107' : '#dc3545',
                    color: path.skillLevel === 'INTERMEDIATE' ? 'black' : 'white'
                  }}>
                    {path.skillLevel}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: path.isActive ? '#28a745' : '#6c757d',
                    color: 'white'
                  }}>
                    {path.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>

              <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                {path.description || 'No description provided'}
              </p>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  <strong>Creator:</strong> {path.creator.name}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  <strong>Modules:</strong> {path.modules.length}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  <strong>Enrollments:</strong> {path.enrollmentCount}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  <strong>Created:</strong> {new Date(path.createdAt).toLocaleDateString()}
                </div>
              </div>

              {path.interests.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '12px' }}>Interests:</strong>
                  <div style={{ marginTop: '5px' }}>
                    {path.interests.map((interest, index) => (
                      <span key={index} style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '3px',
                        fontSize: '11px',
                        marginRight: '5px',
                        marginBottom: '3px'
                      }}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {path.skills.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ fontSize: '12px' }}>Skills:</strong>
                  <div style={{ marginTop: '5px' }}>
                    {path.skills.map((skill, index) => (
                      <span key={index} style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        backgroundColor: '#d1ecf1',
                        borderRadius: '3px',
                        fontSize: '11px',
                        marginRight: '5px',
                        marginBottom: '3px'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => togglePathStatus(path.id, path.isActive)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: path.isActive ? '#ffc107' : '#28a745',
                    color: path.isActive ? 'black' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {path.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => window.open(`/api/learning-paths/${path.id}`, '_blank')}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>Total Paths:</strong> {paths.length} | 
        <strong> Filtered:</strong> {filteredPaths.length} | 
        <strong> Active:</strong> {paths.filter(p => p.isActive).length} | 
        <strong> Inactive:</strong> {paths.filter(p => !p.isActive).length}
      </div>
    </div>
  )
}