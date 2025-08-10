import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Log engagement
    await prisma.engagementLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent')
        }
      }
    })

    // Update or create analytics for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.userAnalytics.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      },
      update: {
        loginCount: {
          increment: 1
        }
      },
      create: {
        userId: user.id,
        date: today,
        loginCount: 1
      }
    })

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        interests: user.interests,
        skills: user.skills
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}