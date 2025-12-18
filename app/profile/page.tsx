'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  interests: string[]
  skills: string[]
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: [] as string[],
    skills: [] as string[],
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [newInterest, setNewInterest] = useState('')
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        interests: parsedUser.interests || [],
        skills: parsedUser.skills || [],
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      fetchUserProfile()
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
    }
  }, [router])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          interests: data.user.interests || [],
          skills: data.user.skills || [],
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match')
      return
    }

    if (formData.newPassword && !formData.currentPassword) {
      setMessage('Current password is required to set a new password')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        interests: formData.interests,
        skills: formData.skills
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Profile updated successfully!')
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        setEditing(false)
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setMessage(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('An error occurred while updating profile')
    } finally {
      setSaving(false)
    }
  }

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      })
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) return (
    <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2rem', color: '#8b5cf6' }}>
      Loading profile...
    </div>
  )

  if (!user) return (
    <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2rem', color: '#8b5cf6' }}>
      Redirecting...
    </div>
  )

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
          }}>👤</span>
          My Profile
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#e9d5ff',
              color: '#7c3aed',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8b5cf6'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#e9d5ff'
              e.currentTarget.style.color = '#7c3aed'
            }}
          >
            ← Dashboard
          </button>
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

      <div style={{ padding: '2rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          padding: '2.5rem',
          borderRadius: '20px',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              border: '4px solid rgba(255, 255, 255, 0.3)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '0.5rem', margin: 0 }}>
                {user.name}
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: '0.95', margin: '0.5rem 0 0.25rem 0' }}>
                {user.email}
              </p>
              <p style={{ fontSize: '0.95rem', opacity: '0.85', margin: 0 }}>
                {user.role} • Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            background: message.includes('success') ? '#d1fae5' : '#fee2e2',
            color: message.includes('success') ? '#065f46' : '#991b1b',
            border: `2px solid ${message.includes('success') ? '#6ee7b7' : '#fca5a5'}`
          }}>
            {message}
          </div>
        )}

        {/* Profile Content */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748', margin: 0 }}>
              Profile Information
            </h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      interests: user.interests || [],
                      skills: user.skills || [],
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                    setMessage('')
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#718096',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e0'
                    e.currentTarget.style.background = '#f7fafc'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.background = 'white'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: saving ? '#cbd5e0' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    transition: 'transform 0.2s',
                    boxShadow: saving ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => !saving && (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => !saving && (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {saving ? '💾 Saving...' : '💾 Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
              Basic Information
            </h3>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                ) : (
                  <p style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '8px', margin: 0, color: '#2d3748' }}>
                    {user.name}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                ) : (
                  <p style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '8px', margin: 0, color: '#2d3748' }}>
                    {user.email}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                  Role
                </label>
                <p style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '8px', margin: 0, color: '#2d3748' }}>
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
              Interests
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              {formData.interests.map((interest, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
                    color: '#5b21b6',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  {interest}
                  {editing && (
                    <button
                      onClick={() => removeInterest(interest)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#7c3aed',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        padding: 0
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {formData.interests.length === 0 && (
                <p style={{ color: '#718096', margin: 0 }}>No interests added yet</p>
              )}
            </div>
            {editing && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  placeholder="Add an interest..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={addInterest}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  + Add
                </button>
              </div>
            )}
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
              Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)',
                    color: '#1e40af',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  {skill}
                  {editing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        padding: 0
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {formData.skills.length === 0 && (
                <p style={{ color: '#718096', margin: 0 }}>No skills added yet</p>
              )}
            </div>
            {editing && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={addSkill}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  + Add
                </button>
              </div>
            )}
          </div>

          {/* Password Change */}
          {editing && (
            <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
                Change Password
              </h3>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
