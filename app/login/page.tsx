'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Login successful!')
        // Store token in localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(data.error || 'Login failed')
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
        maxWidth: '450px',
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
            📚
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#718096', fontSize: '1rem' }}>
            Sign in to continue your learning journey
          </p>
        </div>
        
        <form onSubmit={handleLogin}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
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
            {loading ? '🔄 Signing in...' : '🚀 Sign In'}
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
          padding: '1.5rem',
          background: '#f7fafc',
          borderRadius: '10px'
        }}>
          <h3 style={{ 
            fontSize: '0.85rem', 
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            🧪 Test Accounts
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: '1.8' }}>
            <p><strong style={{ color: '#e53e3e' }}>Admin:</strong> admin@lms.com / admin123</p>
            <p><strong style={{ color: '#9f7aea' }}>Teacher:</strong> teacher@lms.com / teacher123</p>
            <p><strong style={{ color: '#3182ce' }}>Student:</strong> student@lms.com / student123</p>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#718096', fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Create one now
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