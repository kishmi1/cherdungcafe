import { NextRequest } from 'next/server'

export interface StaffSession {
  userId: number
  email: string
  name: string
  role: string
  position?: string
  permissions?: string[]
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

  // Dashboard and profile are always accessible to staff
  if (permission === 'Dashboard' || permission === 'My Profile') {
    return session.role === 'STAFF'
  }

  // Check if the user has the specific permission
  if (session.permissions && session.permissions.length > 0) {
    return session.permissions.includes(permission)
  }

  // If no permissions are set, deny access to permission-based modules
  return false
}

// Keep requirePermission for backward compatibility with existing code
export function requirePermission(request: NextRequest, permission: string): { session: StaffSession } | { error: string; status: number } {
  const session = getStaffSession(request)
  
  if (!session) {
    return { error: 'Unauthorized', status: 401 }
  }

  if (session.role !== 'STAFF') {
    return { error: 'Forbidden: Staff access only', status: 403 }
  }

  // Check if the user has the specific permission
  if (!hasPermission(session, permission)) {
    return { error: 'Forbidden: You do not have permission to access this resource', status: 403 }
  }

  return { session }
}
