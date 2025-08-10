import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

// GET /api/analytics/user - Get user's personal analytics
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get user's enrollment statistics
    const [
      totalEnrollments,
      activeEnrollments,
      completedPaths,
      totalTimeSpent
    ] = await Promise.all([
      prisma.enrollment.count({
        where: { userId: user.userId }
      }),
      prisma.enrollment.count({
        where: { 
          userId: user.userId,
          isActive: true,
          completedAt: null
        }
      }),
      prisma.enrollment.count({
        where: { 
          userId: user.userId,
          completedAt: { not: null }
        }
      }),
      prisma.userAnalytics.aggregate({
        where: {
          userId: user.userId,
          date: { gte: startDate }
        },
        _sum: {
          totalTimeSpent: true
        }
      })
    ])

    // Get daily analytics
    const dailyAnalytics = await prisma.userAnalytics.findMany({
      where: {
        userId: user.userId,
        date: { gte: startDate }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Get module completions
    const moduleCompletions = await prisma.moduleCompletion.findMany({
      where: {
        userId: user.userId,
        completedAt: { gte: startDate }
      },
      include: {
        module: {
          include: {
            path: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    // Get recent engagement
    const recentEngagement = await prisma.engagementLog.findMany({
      where: {
        userId: user.userId,
        timestamp: { gte: startDate }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 20
    })

    // Calculate progress for active enrollments
    const activeEnrollmentsWithProgress = await prisma.enrollment.findMany({
      where: {
        userId: user.userId,
        isActive: true,
        completedAt: null
      },
      include: {
        path: {
          include: {
            modules: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    const progressData = await Promise.all(
      activeEnrollmentsWithProgress.map(async (enrollment) => {
        const completedModules = await prisma.moduleCompletion.count({
          where: {
            userId: user.userId,
            module: {
              pathId: enrollment.pathId
            }
          }
        })

        return {
          pathId: enrollment.pathId,
          pathTitle: enrollment.path.title,
          totalModules: enrollment.path.modules.length,
          completedModules,
          progress: enrollment.path.modules.length > 0 
            ? (completedModules / enrollment.path.modules.length * 100).toFixed(2)
            : 0
        }
      })
    )

    return NextResponse.json({
      summary: {
        totalEnrollments,
        activeEnrollments,
        completedPaths,
        totalTimeSpent: totalTimeSpent._sum.totalTimeSpent || 0,
        completionRate: totalEnrollments > 0 ? (completedPaths / totalEnrollments * 100).toFixed(2) : 0
      },
      dailyActivity: dailyAnalytics.map(day => ({
        date: day.date.toISOString().split('T')[0],
        timeSpent: day.totalTimeSpent,
        modulesCompleted: day.modulesCompleted,
        loginCount: day.loginCount
      })),
      recentCompletions: moduleCompletions.map(completion => ({
        moduleTitle: completion.module.title,
        pathTitle: completion.module.path.title,
        completedAt: completion.completedAt,
        timeSpent: completion.timeSpent
      })),
      currentProgress: progressData,
      recentActivity: recentEngagement.map(log => ({
        action: log.action,
        timestamp: log.timestamp,
        metadata: log.metadata
      }))
    })

  } catch (error) {
    console.error('Error fetching user analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})