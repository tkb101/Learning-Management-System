import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from './auth'

export function requireAuth(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}

export function requireRole(roles: string[]) {
  return function(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const user = getUserFromRequest(request)
      
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      return handler(request, user)
    }
  }
}