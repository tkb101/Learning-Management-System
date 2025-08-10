import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// GET /api/admin/users - Get all users (Admin only)
export const GET = requireRole(['ADMIN'])(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    const where: any = {}

    if (role && role !== 'ALL') {
      where.role = role
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        interests: true,
        skills: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            createdPaths: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      users: users.map(user => ({
        ...user,
        enrollmentCount: user._count.enrollments,
        createdPathsCount: user._count.createdPaths
      }))
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})