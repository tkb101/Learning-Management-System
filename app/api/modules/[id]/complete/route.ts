import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

// POST /api/modules/[id]/complete - Mark module as completed
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAuth(async (req: NextRequest, user: any) => {
  try {
    const { timeSpent } = await request.json()

    // Check if module exists
    const module = await prisma.module.findUnique({
      where: {
        id: params.id,
        isActive: true
      },
      include: {
        path: true
      }
    })

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found or inactive' },
        { status: 404 }
      )
    }

    // Check if user is enrolled in the path
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_pathId: {
          userId: user.userId,
          pathId: module.pathId
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this learning path' },
        { status: 403 }
      )
    }

    // Check if already completed
    const existingCompletion = await prisma.moduleCompletion.findUnique({
      where: {
        userId_moduleId: {
          userId: user.userId,
          moduleId: params.id
        }
      }
    })

    if (existingCompletion) {
      return NextResponse.json(
        { error: 'Module already completed' },
        { status: 400 }
      )
    }

    // Create module completion
    const completion = await prisma.moduleCompletion.create({
      data: {
        userId: user.userId,
        moduleId: params.id,
        timeSpent: timeSpent || 0
      }
    })

    // Update user analytics for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.userAnalytics.upsert({
      where: {
        userId_date: {
          userId: user.userId,
          date: today
        }
      },
      update: {
        totalTimeSpent: {
          increment: timeSpent || 0
        },
        modulesCompleted: {
          increment: 1
        }
      },
      create: {
        userId: user.userId,
        date: today,
        totalTimeSpent: timeSpent || 0,
        modulesCompleted: 1
      }
    })

    // Check if all modules in the path are completed
    const totalModules = await prisma.module.count({
      where: {
        pathId: module.pathId,
        isActive: true
      }
    })

    const completedModules = await prisma.moduleCompletion.count({
      where: {
        userId: user.userId,
        module: {
          pathId: module.pathId,
          isActive: true
        }
      }
    })

    // Update enrollment progress
    const progress = (completedModules / totalModules) * 100

    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        userId_pathId: {
          userId: user.userId,
          pathId: module.pathId
        }
      },
      data: {
        progress,
        ...(progress === 100 && { completedAt: new Date() })
      }
    })

    // Log engagement
    await prisma.engagementLog.create({
      data: {
        userId: user.userId,
        action: 'MODULE_COMPLETE',
        metadata: {
          moduleId: params.id,
          moduleTitle: module.title,
          pathId: module.pathId,
          pathTitle: module.path.title,
          timeSpent: timeSpent || 0
        }
      }
    })

    // If path is completed, log that too and update analytics
    if (progress === 100) {
      await prisma.engagementLog.create({
        data: {
          userId: user.userId,
          action: 'PATH_COMPLETE',
          metadata: {
            pathId: module.pathId,
            pathTitle: module.path.title
          }
        }
      })

      await prisma.userAnalytics.upsert({
        where: {
          userId_date: {
            userId: user.userId,
            date: today
          }
        },
        update: {
          pathsCompleted: {
            increment: 1
          }
        },
        create: {
          userId: user.userId,
          date: today,
          pathsCompleted: 1
        }
      })
    }

    return NextResponse.json({
      message: 'Module completed successfully',
      completion,
      enrollment: {
        progress: updatedEnrollment.progress,
        completedAt: updatedEnrollment.completedAt
      },
      pathCompleted: progress === 100
    })

  } catch (error) {
    console.error('Error completing module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
  })(request)
}