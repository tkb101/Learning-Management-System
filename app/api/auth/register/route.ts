import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'STUDENT', interests = [], skills = [] } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role.toUpperCase(),
        interests,
        skills
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        interests: true,
        skills: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    return NextResponse.json({
      message: 'User created successfully',
      user,
      token
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}