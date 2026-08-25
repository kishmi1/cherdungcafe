import { NextRequest } from 'next/server'

export interface StaffSession {
  userId: number
  email: string
  name: string
  role: string
  position?: string
}

export function getStaffSession(request: NextRequest): StaffSession | null {
  const sessionCookie = request.cookies.get('staffSession')
  
  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value)
    
    if (!sessionData.userId || !sessionData.role) {
      return null
    }

    return sessionData as StaffSession
  } catch (error) {
    console.error('Failed to parse staff session:', error)
    return null
  }
}

export function requireStaffSession(request: NextRequest): { session: StaffSession } | { error: string; status: number } {
  const session = getStaffSession(request)
  
  if (!session) {
    return { error: 'Unauthorized', status: 401 }
  }

  if (session.role !== 'STAFF') {
    return { error: 'Access denied. Staff access only.', status: 403 }
  }

  return { session }
}

// Keep hasPermission for backward compatibility with existing code
export function hasPermission(session: StaffSession | null, permission: string): boolean {
  if (!session) {
    return false
  }

  // Always return true for staff since we removed the permission system
  return session.role === 'STAFF'
}

// Keep requirePermission for backward compatibility with existing code
export function requirePermission(request: NextRequest, permission: string): { session: StaffSession } | { error: string; status: number } {
  const session = getStaffSession(request)
  
  if (!session) {
    return { error: 'Unauthorized', status: 401 }
  }

  // Always allow staff since we removed the permission system
  if (session.role !== 'STAFF') {
    return { error: 'Forbidden: Staff access only', status: 403 }
  }

  return { session }
}
