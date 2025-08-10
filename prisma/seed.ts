import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      interests: ['management', 'education'],
      skills: ['leadership', 'administration']
    }
  })

  // Create teacher user
  const teacherPassword = await bcrypt.hash('teacher123', 12)
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@lms.com' },
    update: {},
    create: {
      email: 'teacher@lms.com',
      password: teacherPassword,
      name: 'John Teacher',
      role: 'TEACHER',
      interests: ['programming', 'web development', 'education'],
      skills: ['javascript', 'react', 'node.js', 'teaching']
    }
  })

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@lms.com' },
    update: {},
    create: {
      email: 'student@lms.com',
      password: studentPassword,
      name: 'Jane Student',
      role: 'STUDENT',
      interests: ['programming', 'web development', 'mobile development'],
      skills: ['html', 'css', 'basic javascript']
    }
  })

  // Create sample learning paths
  const webDevPath = await prisma.learningPath.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack web development from scratch',
      skillLevel: 'BEGINNER',
      interests: ['web development', 'programming'],
      skills: ['html', 'css', 'javascript', 'react', 'node.js'],
      creatorId: teacher.id,
      modules: {
        create: [
          {
            title: 'HTML Fundamentals',
            description: 'Learn the building blocks of web pages',
            content: 'Introduction to HTML tags, elements, and structure...',
            order: 1
          },
          {
            title: 'CSS Styling',
            description: 'Style your web pages with CSS',
            content: 'CSS selectors, properties, flexbox, and grid...',
            order: 2
          },
          {
            title: 'JavaScript Basics',
            description: 'Add interactivity with JavaScript',
            content: 'Variables, functions, DOM manipulation...',
            order: 3
          },
          {
            title: 'React Introduction',
            description: 'Build modern UIs with React',
            content: 'Components, props, state, and hooks...',
            order: 4
          }
        ]
      }
    }
  })

  const dataAnalyticsPath = await prisma.learningPath.create({
    data: {
      title: 'Data Analytics with Python',
      description: 'Learn data analysis and visualization with Python',
      skillLevel: 'INTERMEDIATE',
      interests: ['data science', 'analytics', 'programming'],
      skills: ['python', 'pandas', 'matplotlib', 'statistics'],
      creatorId: teacher.id,
      modules: {
        create: [
          {
            title: 'Python for Data Analysis',
            description: 'Python basics for data science',
            content: 'NumPy, Pandas, and data manipulation...',
            order: 1
          },
          {
            title: 'Data Visualization',
            description: 'Create charts and graphs',
            content: 'Matplotlib, Seaborn, and Plotly...',
            order: 2
          },
          {
            title: 'Statistical Analysis',
            description: 'Statistical methods and hypothesis testing',
            content: 'Descriptive statistics, correlation, regression...',
            order: 3
          }
        ]
      }
    }
  })

  const mobilePath = await prisma.learningPath.create({
    data: {
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile applications',
      skillLevel: 'INTERMEDIATE',
      interests: ['mobile development', 'programming'],
      skills: ['react native', 'javascript', 'mobile ui'],
      creatorId: teacher.id,
      modules: {
        create: [
          {
            title: 'React Native Setup',
            description: 'Environment setup and first app',
            content: 'Installation, project creation, and basic components...',
            order: 1
          },
          {
            title: 'Navigation and State',
            description: 'App navigation and state management',
            content: 'React Navigation, Context API, and Redux...',
            order: 2
          },
          {
            title: 'Native Features',
            description: 'Access device features',
            content: 'Camera, GPS, push notifications...',
            order: 3
          }
        ]
      }
    }
  })

  // Create sample enrollment
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      pathId: webDevPath.id,
      progress: 25
    }
  })

  // Create sample module completion
  const firstModule = await prisma.module.findFirst({
    where: { pathId: webDevPath.id, order: 1 }
  })

  if (firstModule) {
    await prisma.moduleCompletion.create({
      data: {
        userId: student.id,
        moduleId: firstModule.id,
        timeSpent: 45
      }
    })
  }

  // Create sample analytics
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.userAnalytics.create({
    data: {
      userId: student.id,
      date: today,
      totalTimeSpent: 45,
      modulesCompleted: 1,
      loginCount: 1
    }
  })

  // Create sample engagement logs
  await prisma.engagementLog.createMany({
    data: [
      {
        userId: student.id,
        action: 'LOGIN',
        metadata: { timestamp: new Date().toISOString() }
      },
      {
        userId: student.id,
        action: 'PATH_ENROLL',
        metadata: { 
          pathId: webDevPath.id,
          pathTitle: webDevPath.title
        }
      },
      {
        userId: student.id,
        action: 'MODULE_COMPLETE',
        metadata: { 
          moduleId: firstModule?.id,
          moduleTitle: firstModule?.title,
          timeSpent: 45
        }
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📧 Test accounts created:')
  console.log('Admin: admin@lms.com / admin123')
  console.log('Teacher: teacher@lms.com / teacher123')
  console.log('Student: student@lms.com / student123')
  console.log('\n🎯 Sample learning paths created:')
  console.log('- Complete Web Development Bootcamp')
  console.log('- Data Analytics with Python')
  console.log('- Mobile App Development with React Native')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })