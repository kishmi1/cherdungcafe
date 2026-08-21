// Simple in-memory rate limiting for enquiry submissions
// In production, consider using Redis or a similar solution

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const CLEANUP_INTERVAL = 60 * 1000 // Clean up expired entries every minute

// Set up periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)
}

export interface RateLimitResult {
  success: boolean
  remainingRequests: number
  resetTime: number
}

export function rateLimit(
  identifier: string,
  maxRequests: number = 5, // Maximum 5 enquiries per window
  windowMs: number = 60 * 60 * 1000 // 1 hour window
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs
    }
    rateLimitMap.set(identifier, newEntry)
    return {
      success: true,
      remainingRequests: maxRequests - 1,
      resetTime: newEntry.resetTime
    }
  }

  if (entry.count >= maxRequests) {
    return {
      success: false,
      remainingRequests: 0,
      resetTime: entry.resetTime
    }
  }

  // Increment count
  entry.count++
  rateLimitMap.set(identifier, entry)
  return {
    success: true,
    remainingRequests: maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

// Helper to get client identifier from request
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // You could also use user agent or combination for more unique identification
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return `${ip}-${userAgent}`
}