'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Module {
  title: string
  description: string
  content: string
}

export default function AddLearningPathPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillLevel: 'BEGINNER',
    interests: '',
    skills: ''
  })
  const [modules, setModules] = useState<Module[]>([
    { title: '', description: '', content: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleModuleChange = (index: number, field: keyof Module, value: string) => {
    const updatedModules = [...modules]
    updatedModules[index][field] = value
    setModules(updatedModules)
  }

  const addModule = () => {
    setModules([...modules, { title: '', description: '', content: '' }])
  }

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const interests = formData.interests.split(',').map(item => item.trim()).filter(item => item)
      const skills = formData.skills.split(',').map(item => item.trim()).filter(item => item)

      // Validate modules
      const validModules = modules.filter(module => module.title.trim() && module.description.trim())
      if (validModules.length === 0) {
        setError('At least one module with title and description is required')
        setLoading(false)
        return
      }

      const response = await fetch('/api/learning-paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          interests,
          skills,
          modules: validModules
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Learning path "${formData.title}" created successfully!`)
        setFormData({
          title: '',
          description: '',
          skillLevel: 'BEGINNER',
          interests: '',
          skills: ''
        })
        setModules([{ title: '', description: '', content: '' }])
      } else {
        setError(data.error || 'Failed to create learning path')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Create Learning Path</h1>
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

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <h3 style={{ marginBottom: '20px', color: '#007bff' }}>Basic Information</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Learning Path Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="skillLevel" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Skill Level *
            </label>
            <select
              id="skillLevel"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="interests" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Target Interests
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., programming, web development, data science"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            <small style={{ color: '#666' }}>Separate multiple interests with commas</small>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="skills" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Skills Covered
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., javascript, html, css, react"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            <small style={{ color: '#666' }}>Separate multiple skills with commas</small>
          </div>

          {/* Modules Section */}
          <h3 style={{ marginBottom: '20px', color: '#007bff' }}>Learning Modules</h3>
          
          {modules.map((module, index) => (
            <div key={index} style={{
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '20px',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4>Module {index + 1}</h4>
                {modules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeModule(index)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Module Title *
                </label>
                <input
                  type="text"
                  value={module.title}
                  onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Module Description *
                </label>
                <textarea
                  value={module.description}
                  onChange={(e) => handleModuleChange(index, 'description', e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Module Content
                </label>
                <textarea
                  value={module.content}
                  onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                  rows={4}
                  placeholder="Enter module content, instructions, or learning materials..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addModule}
            style={{
              padding: '10px 15px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '30px'
            }}
          >
            + Add Another Module
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Creating Learning Path...' : 'Create Learning Path'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px'
          }}>
            <strong>Success:</strong> {success}
          </div>
        )}
      </div>
    </div>
  )
}