import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

// GET /api/recommendations - Get personalized learning path recommendations
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    // Get user's profile
    const userProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        interests: true,
        skills: true,
        enrollments: {
          include: {
            path: {
              select: {
                interests: true,
                skills: true,
                skillLevel: true
              }
            }
          }
        }
      }
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get paths user is already enrolled in
    const enrolledPathIds = userProfile.enrollments.map(e => e.path)

    // Find paths that match user's interests
    const interestBasedPaths = await prisma.learningPath.findMany({
      where: {
        isActive: true,
        NOT: {
          id: {
            in: userProfile.enrollments.map(e => e.pathId)
          }
        },
        interests: {
          hasSome: userProfile.interests
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      take: 10
    })

    // Find paths that help develop user's existing skills
    const skillBasedPaths = await prisma.learningPath.findMany({
      where: {
        isActive: true,
        NOT: {
          id: {
            in: userProfile.enrollments.map(e => e.pathId)
          }
        },
        skills: {
          hasSome: userProfile.skills
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      take: 10
    })

    // Find popular paths (trending)
    const popularPaths = await prisma.learningPath.findMany({
      where: {
        isActive: true,
        NOT: {
          id: {
            in: userProfile.enrollments.map(e => e.pathId)
          }
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Calculate recommendation scores
    const scoreRecommendations = (paths: any[], type: 'interest' | 'skill' | 'popular') => {
      return paths.map(path => {
        let score = 0
        
        // Base score based on type
        if (type === 'interest') {
          const matchingInterests = path.interests.filter((interest: string) => 
            userProfile.interests.includes(interest)
          ).length
          score += matchingInterests * 10
        }
        
        if (type === 'skill') {
          const matchingSkills = path.skills.filter((skill: string) => 
            userProfile.skills.includes(skill)
          ).length
          score += matchingSkills * 8
        }
        
        if (type === 'popular') {
          score += Math.min(path._count.enrollments * 2, 20) // Cap at 20 points
        }

        // Bonus for beginner paths if user has few enrollments
        if (userProfile.enrollments.length < 3 && path.skillLevel === 'BEGINNER') {
          score += 5
        }

        return {
          ...path,
          recommendationScore: score,
          recommendationType: type,
          matchingInterests: type === 'interest' ? 
            path.interests.filter((interest: string) => userProfile.interests.includes(interest)) : [],
          matchingSkills: type === 'skill' ? 
            path.skills.filter((skill: string) => userProfile.skills.includes(skill)) : []
        }
      })
    }

    const interestRecommendations = scoreRecommendations(interestBasedPaths, 'interest')
    const skillRecommendations = scoreRecommendations(skillBasedPaths, 'skill')
    const popularRecommendations = scoreRecommendations(popularPaths, 'popular')

    // Combine and deduplicate recommendations
    const allRecommendations = [
      ...interestRecommendations,
      ...skillRecommendations,
      ...popularRecommendations
    ]

    // Remove duplicates and sort by score
    const uniqueRecommendations = allRecommendations
      .filter((path, index, self) => 
        index === self.findIndex(p => p.id === path.id)
      )
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 15)

    return NextResponse.json({
      recommendations: uniqueRecommendations.map(path => ({
        id: path.id,
        title: path.title,
        description: path.description,
        skillLevel: path.skillLevel,
        interests: path.interests,
        skills: path.skills,
        creator: path.creator,
        enrollmentCount: path._count.enrollments,
        recommendationScore: path.recommendationScore,
        recommendationType: path.recommendationType,
        matchingInterests: path.matchingInterests || [],
        matchingSkills: path.matchingSkills || [],
        createdAt: path.createdAt
      })),
      userProfile: {
        interests: userProfile.interests,
        skills: userProfile.skills,
        enrollmentCount: userProfile.enrollments.length
      }
    })

  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})