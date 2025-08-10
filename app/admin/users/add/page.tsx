'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    interests: '',
    skills: ''
  })
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
      if (user.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          interests,
          skills
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`User "${formData.name}" created successfully!`)
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'STUDENT',
          interests: '',
          skills: ''
        })
      } else {
        setError(data.error || 'Failed to create user')
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
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Add New User</h1>
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
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
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
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            <small style={{ color: '#666' }}>Minimum 6 characters</small>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              User Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="interests" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Interests
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
              Skills
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., javascript, html, css, python"
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Creating User...' : 'Create User'}
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