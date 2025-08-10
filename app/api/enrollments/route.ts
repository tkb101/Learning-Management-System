import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

// GET /api/enrollments - Get user's enrollments
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'active', 'completed'

    const where: any = {
      userId: user.userId
    }

    if (status === 'completed') {
      where.completedAt = { not: null }
    } else if (status === 'active') {
      where.completedAt = null
      where.isActive = true
    }

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        path: {
          include: {
            creator: {
              select: {
                id: true,
                name: true
              }
            },
            modules: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    })

    return NextResponse.json({ enrollments })

  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

// POST /api/enrollments - Enroll in a learning path
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { pathId } = await request.json()

    if (!pathId) {
      return NextResponse.json(
        { error: 'Path ID is required' },
        { status: 400 }
      )
    }

    // Check if path exists and is active
    const path = await prisma.learningPath.findUnique({
      where: {
        id: pathId,
        isActive: true
      }
    })

    if (!path) {
      return NextResponse.json(
        { error: 'Learning path not found or inactive' },
        { status: 404 }
      )
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_pathId: {
          userId: user.userId,
          pathId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this learning path' },
        { status: 400 }
      )
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.userId,
        pathId
      },
      include: {
        path: {
          include: {
            creator: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    // Log engagement
    await prisma.engagementLog.create({
      data: {
        userId: user.userId,
        action: 'PATH_ENROLL',
        metadata: {
          pathId,
          pathTitle: path.title
        }
      }
    })

    return NextResponse.json({
      message: 'Successfully enrolled in learning path',
      enrollment
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})