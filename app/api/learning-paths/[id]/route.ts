import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, requireRole } from '@/lib/middleware'

// GET /api/learning-paths/[id] - Get specific learning path
export const GET = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    const path = await prisma.learningPath.findUnique({
      where: {
        id: params.id,
        isActive: true
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
        },
        enrollments: {
          where: {
            userId: user.userId
          },
          select: {
            id: true,
            progress: true,
            enrolledAt: true,
            completedAt: true
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    })

    if (!path) {
      return NextResponse.json(
        { error: 'Learning path not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      path: {
        ...path,
        enrollmentCount: path._count.enrollments,
        userEnrollment: path.enrollments[0] || null
      }
    })

  } catch (error) {
    console.error('Error fetching learning path:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

// PUT /api/learning-paths/[id] - Update learning path (Creator/Admin only)
export const PUT = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    const { title, description, skillLevel, interests, skills, isActive } = await request.json()

    // Check if user can edit this path
    const existingPath = await prisma.learningPath.findUnique({
      where: { id: params.id }
    })

    if (!existingPath) {
      return NextResponse.json(
        { error: 'Learning path not found' },
        { status: 404 }
      )
    }

    if (existingPath.creatorId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const updatedPath = await prisma.learningPath.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(skillLevel && { skillLevel: skillLevel.toUpperCase() }),
        ...(interests && { interests }),
        ...(skills && { skills }),
        ...(isActive !== undefined && { isActive })
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

    return NextResponse.json({
      message: 'Learning path updated successfully',
      path: updatedPath
    })

  } catch (error) {
    console.error('Error updating learning path:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

// DELETE /api/learning-paths/[id] - Delete learning path (Creator/Admin only)
export const DELETE = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    // Check if user can delete this path
    const existingPath = await prisma.learningPath.findUnique({
      where: { id: params.id }
    })

    if (!existingPath) {
      return NextResponse.json(
        { error: 'Learning path not found' },
        { status: 404 }
      )
    }

    if (existingPath.creatorId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    await prisma.learningPath.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return NextResponse.json({
      message: 'Learning path deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting learning path:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})