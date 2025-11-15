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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => router.back()}
        style={{
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ← Back
      </button>

      <h1>Learning Resources</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <AccordionItem
              key={article.id}
              article={article}
              isOpen={openId === article.id}
              onToggle={() => setOpenId(openId === article.id ? null : article.id)}
            />
          ))
        ) : (
          !loading && (
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: '#666' }}>No articles available yet. Keep learning to unlock personalized resources!</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
