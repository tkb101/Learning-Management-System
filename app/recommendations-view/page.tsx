'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface BlogArticle {
  id: string
  title: string
  sections: Array<{
    heading: string
    content: string
  }>
}

const AccordionItem = ({ article, isOpen, onToggle }: { article: BlogArticle; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div style={{ marginBottom: '12px', border: '1px solid #dee2e6', borderRadius: '8px', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: isOpen ? '#f8f9fa' : 'white',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isOpen ? '#f8f9fa' : 'white'}
      >
        <span>{article.title}</span>
        <span style={{ fontSize: '20px', color: '#007bff' }}>{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div style={{ padding: '16px', backgroundColor: 'white', borderTop: '1px solid #dee2e6' }}>
          {article.sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: idx < article.sections.length - 1 ? '16px' : 0 }}>
              <h4 style={{ marginTop: 0, marginBottom: '8px', color: '#333', fontSize: '14px' }}>
                {section.heading}
              </h4>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RecommendationsPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchRecommendations()
  }, [router])

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      
      // Transform recommendations to blog format with 3 sections each
      let recommendations = []
      if (Array.isArray(data)) {
        recommendations = data
      } else if (data.recommendations && Array.isArray(data.recommendations)) {
        recommendations = data.recommendations
      } else if (data.data && Array.isArray(data.data)) {
        recommendations = data.data
      }
      
      const blogArticles = recommendations.map((rec: any, idx: number) => ({
        id: rec.id || idx,
        title: rec.title || 'Article',
        sections: [
          {
            heading: 'Overview',
            content: rec.description || rec.reason || 'Learn more about this topic through guided modules and hands-on practice.'
          },
          {
            heading: 'Why This Path',
            content: rec.reason || 'Based on your learning history and interests, this path will help you progress to the next level.'
          },
          {
            heading: 'What You\'ll Learn',
            content: rec.skillLevel ? `This ${rec.skillLevel} level course covers essential concepts and practical applications.` : 'You will gain valuable skills and knowledge applicable to real-world scenarios.'
          }
        ]
      }))
      
      setArticles(blogArticles)
      setError(null)
    } catch (err) {
      setError('Failed to load recommendations')
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: '#f59e0b',
            border: '2px solid #f59e0b',
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '2rem',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f59e0b'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.color = '#f59e0b'
          }}
        >
          ← Back to Dashboard
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          padding: '2.5rem',
          borderRadius: '20px',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
            fontWeight: '700',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            ✨ Personalized Recommendations
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.95', margin: '0.5rem 0 0 0' }}>
            AI-powered course suggestions based on your learning profile
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
            <div className="pulse" style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>Finding perfect matches for you...</p>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article.id} style={{ 
                marginBottom: '0.75rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '16px', 
                overflow: 'hidden',
                background: 'white',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.15)'
                e.currentTarget.style.borderColor = '#f59e0b'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}>
                <button
                  onClick={() => setOpenId(openId === article.id ? null : article.id)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    background: openId === article.id ? '#fffbeb' : 'white',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#2d3748',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      📚
                    </div>
                    <span>{article.title}</span>
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    transition: 'transform 0.3s'
                  }}>
                    {openId === article.id ? '−' : '+'}
                  </div>
                </button>

                {openId === article.id && (
                  <div style={{ 
                    padding: '1.5rem', 
                    background: 'white', 
                    borderTop: '1px solid #e2e8f0',
                    animation: 'fadeIn 0.3s ease-out'
                  }}>
                    {article.sections.map((section, idx) => (
                      <div key={idx} style={{ marginBottom: idx < article.sections.length - 1 ? '1.5rem' : 0 }}>
                        <h4 style={{ 
                          marginTop: 0, 
                          marginBottom: '0.75rem', 
                          color: '#2d3748', 
                          fontSize: '1rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span style={{ color: '#f59e0b' }}>▸</span>
                          {section.heading}
                        </h4>
                        <p style={{ 
                          margin: 0, 
                          color: '#718096', 
                          fontSize: '0.95rem', 
                          lineHeight: '1.7',
                          paddingLeft: '1.5rem'
                        }}>
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            !loading && (
              <div style={{ 
                padding: '4rem',
                background: 'white',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                  No Recommendations Yet
                </h3>
                <p style={{ color: '#718096', fontSize: '1.05rem' }}>
                  Keep learning to unlock personalized course suggestions!
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
