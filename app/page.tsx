export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 5%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '2rem' }}>📚</span>
          EduPlatform
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/login" style={{ 
            padding: '0.75rem 1.5rem',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            border: '2px solid white',
            fontWeight: '500',
            transition: 'all 0.3s',
            background: 'transparent'
          }}>
            Login
          </a>
          <a href="/register" style={{ 
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.3s',
            border: '2px solid white'
          }}>
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '5rem 5%',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '800',
          marginBottom: '1.5rem',
          lineHeight: '1.2',
          letterSpacing: '-0.02em'
        }}>
          Transform Your Learning Journey
        </h1>
        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
          marginBottom: '3rem',
          maxWidth: '700px',
          margin: '0 auto 3rem',
          opacity: '0.95',
          lineHeight: '1.6'
        }}>
          Unlock your potential with personalized learning paths, expert-led courses, and AI-powered recommendations.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/register" style={{ 
            padding: '1rem 2.5rem',
            background: 'white',
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '1.1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s',
            border: 'none'
          }}>
            Start Learning Free
          </a>
          <a href="#features" style={{ 
            padding: '1rem 2.5rem',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1.1rem',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            Explore Features
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: '5rem 5%',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '30px 30px 0 0'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '1rem',
          color: '#2d3748'
        }}>
          Why Choose EduPlatform?
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '1.2rem',
          color: '#718096',
          marginBottom: '4rem',
          maxWidth: '600px',
          margin: '0 auto 4rem'
        }}>
          Everything you need to succeed in your learning journey
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            padding: '2.5rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
              Personalized Learning Paths
            </h3>
            <p style={{ color: '#718096', lineHeight: '1.7' }}>
              AI-powered recommendations tailored to your skills, interests, and learning goals.
            </p>
          </div>

          <div style={{
            padding: '2.5rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
              Advanced Analytics
            </h3>
            <p style={{ color: '#718096', lineHeight: '1.7' }}>
              Track your progress with detailed insights and performance metrics in real-time.
            </p>
          </div>

          <div style={{
            padding: '2.5rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
              Expert Instructors
            </h3>
            <p style={{ color: '#718096', lineHeight: '1.7' }}>
              Learn from industry professionals and certified educators worldwide.
            </p>
          </div>

          <div style={{
            padding: '2.5rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
              Certificates & Badges
            </h3>
            <p style={{ color: '#718096', lineHeight: '1.7' }}>
              Earn recognized certificates and showcase your achievements to employers.
            </p>
          </div>

          <div style={{
            padding: '2.5rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
              Interactive Community
            </h3>
            <p style={{ color: '#718096', lineHeight: '1.7' }}>
              Connect with peers, join study groups, and collaborate on projects.
            </p>
          </div>

          <div style={{
            padding: '2.5rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
              Self-Paced Learning
            </h3>
            <p style={{ color: '#718096', lineHeight: '1.7' }}>
              Study at your own pace with lifetime access to course materials.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '4rem 5%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>10,000+</div>
            <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Active Learners</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>500+</div>
            <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Courses Available</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>95%</div>
            <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Satisfaction Rate</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>24/7</div>
            <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Support Available</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '5rem 5%',
        background: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: '700',
          marginBottom: '1.5rem',
          color: '#2d3748'
        }}>
          Ready to Start Learning?
        </h2>
        <p style={{
          fontSize: '1.2rem',
          color: '#718096',
          marginBottom: '2.5rem',
          maxWidth: '600px',
          margin: '0 auto 2.5rem'
        }}>
          Join thousands of learners already transforming their careers with EduPlatform
        </p>
        <a href="/register" style={{ 
          padding: '1.25rem 3rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '1.2rem',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          display: 'inline-block',
          transition: 'transform 0.3s',
          border: 'none'
        }}>
          Create Free Account
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 5%',
        background: '#2d3748',
        color: 'white',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '1rem', opacity: '0.8' }}>
          © 2024 EduPlatform. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Terms of Service</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Contact Us</a>
        </div>
      </footer>
    </div>
  )
}