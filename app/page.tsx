export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Learning Management System API</h1>
        <p>Welcome to the LMS API. This is a basic Next.js application with JWT authentication, Prisma, and PostgreSQL.</p>
        
        <div style={{ margin: '20px 0' }}>
          <a href="/login" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            marginRight: '10px'
          }}>
            Login
          </a>
          <a href="/register" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px'
          }}>
            Register
          </a>
        </div>
      </div>
      
      <h2>Available Endpoints:</h2>
      
      <h3>Authentication</h3>
      <ul>
        <li><strong>POST /api/auth/register</strong> - Register a new user</li>
        <li><strong>POST /api/auth/login</strong> - Login user</li>
      </ul>
      
      <h3>Learning Paths</h3>
      <ul>
        <li><strong>GET /api/learning-paths</strong> - Get all learning paths</li>
        <li><strong>POST /api/learning-paths</strong> - Create new learning path (Teacher/Admin)</li>
        <li><strong>GET /api/learning-paths/[id]</strong> - Get specific learning path</li>
        <li><strong>PUT /api/learning-paths/[id]</strong> - Update learning path</li>
        <li><strong>DELETE /api/learning-paths/[id]</strong> - Delete learning path</li>
      </ul>
      
      <h3>Enrollments</h3>
      <ul>
        <li><strong>GET /api/enrollments</strong> - Get user enrollments</li>
        <li><strong>POST /api/enrollments</strong> - Enroll in learning path</li>
      </ul>
      
      <h3>Modules</h3>
      <ul>
        <li><strong>POST /api/modules/[id]/complete</strong> - Mark module as completed</li>
      </ul>
      
      <h3>Analytics</h3>
      <ul>
        <li><strong>GET /api/analytics/overview</strong> - System analytics (Admin/Teacher)</li>
        <li><strong>GET /api/analytics/user</strong> - User personal analytics</li>
      </ul>
      
      <h3>Recommendations</h3>
      <ul>
        <li><strong>GET /api/recommendations</strong> - Get personalized recommendations</li>
      </ul>
      
      <h2>Setup Instructions:</h2>
      <ol>
        <li>Install dependencies: <code>npm install</code></li>
        <li>Set up PostgreSQL database</li>
        <li>Copy <code>.env.example</code> to <code>.env</code> and configure</li>
        <li>Run Prisma migrations: <code>npm run db:push</code></li>
        <li>Start development server: <code>npm run dev</code></li>
      </ol>
      
      <h2>User Roles:</h2>
      <ul>
        <li><strong>ADMIN</strong> - Full system access</li>
        <li><strong>TEACHER</strong> - Can create and manage learning paths</li>
        <li><strong>STUDENT</strong> - Can enroll and complete learning paths</li>
      </ul>
    </div>
  )
}