import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'
import bcrypt from 'bcryptjs'

// GET /api/profile - Get current user profile
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        interests: true,
        skills: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            enrollments: true,
            createdPaths: true
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

    return NextResponse.json({
      user: {
        ...userProfile,
        enrollmentCount: userProfile._count.enrollments,
        createdPathCount: userProfile._count.createdPaths
      }
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

// PUT /api/profile - Update current user profile
export const PUT = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { name, email, interests, skills, currentPassword, newPassword } = await request.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser && existingUser.id !== user.userId) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
      interests: interests || [],
      skills: skills || []
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password' },
          { status: 400 }
        )
      }

      // Verify current password
      const currentUser = await prisma.user.findUnique({
        where: { id: user.userId }
      })

      if (!currentUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        interests: true,
        skills: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
