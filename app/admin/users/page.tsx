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

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
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
      return
    }

    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        setError('Failed to fetch users')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (loading) return <div style={{ padding: '20px' }}>Loading users...</div>

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Manage Users</h1>
        <div>
          <button
            onClick={() => router.push('/admin/users/add')}
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
            Add User
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
            placeholder="Search by name or email..."
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
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

      {/* Users List */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {filteredUsers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            {users.length === 0 ? 'No users found. Create some users first.' : 'No users match your search criteria.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Role</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Interests</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Skills</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      <strong>{user.name}</strong>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: 
                          user.role === 'ADMIN' ? '#dc3545' :
                          user.role === 'TEACHER' ? '#ffc107' : '#28a745',
                        color: user.role === 'TEACHER' ? 'black' : 'white'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      <div style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.interests.length > 0 ? user.interests.join(', ') : 'None'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      <div style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.skills.length > 0 ? user.skills.join(', ') : 'None'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>Total Users:</strong> {users.length} | 
        <strong> Filtered:</strong> {filteredUsers.length} | 
        <strong> Admins:</strong> {users.filter(u => u.role === 'ADMIN').length} | 
        <strong> Teachers:</strong> {users.filter(u => u.role === 'TEACHER').length} | 
        <strong> Students:</strong> {users.filter(u => u.role === 'STUDENT').length}
      </div>
    </div>
  )
}