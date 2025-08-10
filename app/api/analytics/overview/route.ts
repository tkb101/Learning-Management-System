import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// GET /api/analytics/overview - Get system overview analytics (Admin/Teacher only)
export const GET = requireRole(['ADMIN', 'TEACHER'])(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total counts
    const [
      totalUsers,
      totalPaths,
      totalEnrollments,
      activeEnrollments,
      completedPaths
    ] = await Promise.all([
      prisma.user.count(),
      prisma.learningPath.count({ where: { isActive: true } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { isActive: true, completedAt: null } }),
      prisma.enrollment.count({ where: { completedAt: { not: null } } })
    ])

    // Get user registrations over time
    const userRegistrations = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    })

    // Get enrollment trends
    const enrollmentTrends = await prisma.enrollment.groupBy({
      by: ['enrolledAt'],
      where: {
        enrolledAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    })

    // Get most popular learning paths
    const popularPaths = await prisma.learningPath.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        },
        creator: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      },
      take: 10
    })

    // Get engagement statistics
    const engagementStats = await prisma.engagementLog.groupBy({
      by: ['action'],
      where: {
        timestamp: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    })

    return NextResponse.json({
      overview: {
        totalUsers,
        totalPaths,
        totalEnrollments,
        activeEnrollments,
        completedPaths,
        completionRate: totalEnrollments > 0 ? (completedPaths / totalEnrollments * 100).toFixed(2) : 0
      },
      trends: {
        userRegistrations: userRegistrations.map(item => ({
          date: item.createdAt.toISOString().split('T')[0],
          count: item._count.id
        })),
        enrollments: enrollmentTrends.map(item => ({
          date: item.enrolledAt.toISOString().split('T')[0],
          count: item._count.id
        }))
      },
      popularPaths: popularPaths.map(path => ({
        id: path.id,
        title: path.title,
        creator: path.creator.name,
        enrollmentCount: path._count.enrollments
      })),
      engagement: engagementStats.reduce((acc, stat) => {
        acc[stat.action] = stat._count.id
        return acc
      }, {} as Record<string, number>)
    })

  } catch (error) {
    console.error('Error fetching analytics overview:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})