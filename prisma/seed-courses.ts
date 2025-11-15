// prisma/seed-courses.ts
// This seed file adds 5 sample learning paths to the database
// Run with: npx tsx prisma/seed-courses.ts

import { PrismaClient, SkillLevel } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting to seed 5 learning paths...')

  // First, create or get an admin user to be the creator
  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminUser) {
    console.log('Creating default admin user...')
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@lms.com',
        password: 'hashed_password', // In production, use proper hashing
        name: 'Admin User',
        role: 'ADMIN'
      }
    })
    console.log('✓ Admin user created')
  }

  const courses: Array<{
    title: string
    description: string
    skillLevel: SkillLevel
    interests: string[]
    skills: string[]
  }> = [
    {
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of web development including HTML, CSS, and JavaScript. This course covers essential concepts to get you started building websites.',
      skillLevel: 'BEGINNER',
      interests: ['web', 'frontend', 'javascript'],
      skills: ['HTML', 'CSS', 'JavaScript']
    },
    {
      title: 'React Advanced Patterns',
      description: 'Master advanced React patterns and best practices. Learn about hooks, state management, and performance optimization for building production-ready applications.',
      skillLevel: 'INTERMEDIATE',
      interests: ['react', 'frontend', 'javascript'],
      skills: ['React', 'JavaScript', 'State Management']
    },
    {
      title: 'Database Design & SQL',
      description: 'Deep dive into database design principles and SQL. Learn how to design efficient databases and write complex queries for real-world applications.',
      skillLevel: 'INTERMEDIATE',
      interests: ['database', 'sql', 'backend'],
      skills: ['SQL', 'Database Design', 'PostgreSQL']
    },
    {
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile applications using React Native. Learn to develop iOS and Android apps with a single codebase.',
      skillLevel: 'ADVANCED',
      interests: ['mobile', 'react-native', 'javascript'],
      skills: ['React Native', 'Mobile Development', 'JavaScript']
    },
    {
      title: 'Cloud Computing with AWS',
      description: 'Learn AWS cloud services and infrastructure. Deploy, scale, and manage applications on the cloud using AWS services.',
      skillLevel: 'ADVANCED',
      interests: ['cloud', 'aws', 'devops'],
      skills: ['AWS', 'Cloud Architecture', 'DevOps']
    }
  ]

  try {
    for (const course of courses) {
      const existingCourse = await prisma.learningPath.findFirst({
        where: { title: course.title }
      })

      if (existingCourse) {
        console.log(`Course "${course.title}" already exists. Skipping...`)
        continue
      }

      const newCourse = await prisma.learningPath.create({
        data: {
          title: course.title,
          description: course.description,
          skillLevel: course.skillLevel,
          interests: course.interests,
          skills: course.skills,
          creatorId: adminUser!.id
        }
      })

      console.log(`✓ Created course: "${newCourse.title}" (ID: ${newCourse.id})`)
    }

    console.log('\n✓ All courses seeded successfully!')
  } catch (error) {
    console.error('Error seeding courses:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
