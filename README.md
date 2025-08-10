# Learning Management System

A basic Learning Management System built with Next.js, Prisma, PostgreSQL, and JWT authentication.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access (Admin, Teacher, Student)
- **Learning Path Management**: Create, update, and manage learning paths with modules
- **Enrollment System**: Students can enroll in learning paths and track progress
- **Analytics & Reporting**: Comprehensive analytics for engagement and learning trends
- **Personalized Recommendations**: AI-driven learning path recommendations based on interests and skills
- **Progress Tracking**: Module completion tracking with time spent analytics

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Language**: TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Install and start PostgreSQL
2. Create a new database for the LMS
3. Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"
JWT_SECRET="your-super-secret-jwt-key-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### 3. Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Learning Paths

- `GET /api/learning-paths` - Get all learning paths
- `POST /api/learning-paths` - Create learning path (Teacher/Admin)
- `GET /api/learning-paths/[id]` - Get specific learning path
- `PUT /api/learning-paths/[id]` - Update learning path
- `DELETE /api/learning-paths/[id]` - Delete learning path

### Enrollments

- `GET /api/enrollments` - Get user enrollments
- `POST /api/enrollments` - Enroll in learning path

### Modules

- `POST /api/modules/[id]/complete` - Mark module as completed

### Analytics

- `GET /api/analytics/overview` - System analytics (Admin/Teacher)
- `GET /api/analytics/user` - User personal analytics

### Recommendations

- `GET /api/recommendations` - Get personalized recommendations

## User Roles

- **ADMIN**: Full system access, can manage all users and content
- **TEACHER**: Can create and manage learning paths, view analytics
- **STUDENT**: Can enroll in learning paths, complete modules, view personal analytics

## Database Schema

The system includes the following main entities:

- **Users**: Authentication and profile information
- **Learning Paths**: Course containers with metadata
- **Modules**: Individual learning units within paths
- **Enrollments**: User-path relationships with progress tracking
- **Module Completions**: Individual module completion records
- **User Analytics**: Daily analytics aggregation
- **Engagement Logs**: Detailed activity tracking

## Example Usage

### 1. Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "STUDENT",
    "interests": ["programming", "web development"],
    "skills": ["javascript", "html"]
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### 3. Create a learning path (as Teacher/Admin)

```bash
curl -X POST http://localhost:3000/api/learning-paths \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Introduction to Web Development",
    "description": "Learn the basics of web development",
    "skillLevel": "BEGINNER",
    "interests": ["web development", "programming"],
    "skills": ["html", "css", "javascript"],
    "modules": [
      {
        "title": "HTML Basics",
        "description": "Learn HTML fundamentals",
        "content": "HTML content here..."
      },
      {
        "title": "CSS Styling",
        "description": "Learn CSS basics",
        "content": "CSS content here..."
      }
    ]
  }'
```

### 4. Enroll in a learning path

```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "pathId": "LEARNING_PATH_ID"
  }'
```

### 5. Complete a module

```bash
curl -X POST http://localhost:3000/api/modules/MODULE_ID/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "timeSpent": 30
  }'
```

## Development

### Database Management

```bash
# View database in Prisma Studio
npm run db:studio

# Reset database (development only)
npx prisma db push --force-reset
```

### Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── page.tsx       # Home page
│   └── layout.tsx     # Root layout
├── lib/
│   ├── db.ts          # Database connection
│   ├── auth.ts        # Authentication utilities
│   └── middleware.ts  # API middleware
├── prisma/
│   └── schema.prisma  # Database schema
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes.