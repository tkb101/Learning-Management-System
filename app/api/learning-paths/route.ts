import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, requireRole } from '@/lib/middleware'

// GET /api/learning-paths - Get all learning paths (with optional filtering)
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const interest = searchParams.get('interest')
    const skillLevel = searchParams.get('skillLevel')
    const creatorId = searchParams.get('creatorId')

    const where: any = {
      isActive: true
    }

    if (interest) {
      where.interests = {
        has: interest
      }
    }

    if (skillLevel) {
      where.skillLevel = skillLevel.toUpperCase()
    }

    if (creatorId) {
      where.creatorId = creatorId
    }

    const paths = await prisma.learningPath.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        modules: {
          select: {
            id: true,
            title: true,
            order: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      paths: paths.map(path => ({
        ...path,
        enrollmentCount: path._count.enrollments
      }))
    })

  } catch (error) {
    console.error('Error fetching learning paths:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

// POST /api/learning-paths - Create new learning path (Teachers/Admins only)
export const POST = requireRole(['TEACHER', 'ADMIN'])(async (request: NextRequest, user: any) => {
  try {
    const { title, description, skillLevel = 'BEGINNER', interests = [], skills = [], modules = [] } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const path = await prisma.learningPath.create({
      data: {
        title,
        description,
        skillLevel: skillLevel.toUpperCase(),
        interests,
        skills,
        creatorId: user.userId,
        modules: {
          create: modules.map((module: any, index: number) => ({
            title: module.title,
            description: module.description,
            content: module.content,
            order: index + 1
          }))
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        modules: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    // Log engagement
    await prisma.engagementLog.create({
      data: {
        userId: user.userId,
        action: 'PATH_CREATE',
        metadata: {
          pathId: path.id,
          pathTitle: path.title
        }
      }
    })

    return NextResponse.json({
      message: 'Learning path created successfully',
      path
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating learning path:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})