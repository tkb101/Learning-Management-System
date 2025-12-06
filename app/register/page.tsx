'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'STUDENT',
    interests: '',
    skills: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

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
      const interests = formData.interests.split(',').map(item => item.trim()).filter(item => item)
      const skills = formData.skills.split(',').map(item => item.trim()).filter(item => item)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          interests,
          skills
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '550px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '3rem',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '0.5rem'
          }}>
            🎓
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '0.5rem'
          }}>
            Join EduPlatform
          </h1>
          <p style={{ color: '#718096', fontSize: '1rem' }}>
            Create your account and start learning today
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label htmlFor="name" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: '#2d3748',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  background: '#f7fafc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label htmlFor="role" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: '#2d3748',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  background: '#f7fafc',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="STUDENT">🎓 Student</option>
                <option value="TEACHER">👨‍🏫 Teacher</option>
                <option value="ADMIN">👑 Admin</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.3s',
                background: '#f7fafc'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  paddingRight: '3rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  background: '#f7fafc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#718096'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="interests" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Interests <span style={{ color: '#718096', fontWeight: '400' }}>(optional)</span>
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., Programming, Web Development, Data Science"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.3s',
                background: '#f7fafc'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <p style={{ 
              fontSize: '0.8rem', 
              color: '#718096', 
              marginTop: '0.25rem',
              marginLeft: '0.5rem'
            }}>
              Separate with commas
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="skills" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Skills <span style={{ color: '#718096', fontWeight: '400' }}>(optional)</span>
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, HTML, CSS, Python"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.3s',
                background: '#f7fafc'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <p style={{ 
              fontSize: '0.8rem', 
              color: '#718096', 
              marginTop: '0.25rem',
              marginLeft: '0.5rem'
            }}>
              Separate with commas
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '700',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s',
              marginBottom: '1rem'
            }}
          >
            {loading ? '⏳ Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#fed7d7',
            color: '#c53030',
            border: '1px solid #fc8181',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#c6f6d5',
            color: '#22543d',
            border: '1px solid #9ae6b4',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            ✅ {success}
          </div>
        )}

        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#718096', fontSize: '0.95rem' }}>
            Already have an account?{' '}
            <a href="/login" style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Sign in here
            </a>
          </p>
          <a href="/" style={{ 
            display: 'inline-block',
            marginTop: '1rem',
            color: '#718096', 
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}