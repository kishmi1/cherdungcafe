import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { $Enums } from '@/generated/prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('adminSession')
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    if (!sessionData.userId || !sessionData.role) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Check if user is ADMIN
    if (sessionData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all staff (including admins for reference, but filter by role)
    const staff = await prisma.user.findMany({
      where: {
        role: $Enums.UserRole.STAFF
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        position: true,
        profileImage: true,
        joiningDate: true,
        status: true,
        permissions: true,
        createdAt: true
      }
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching staff' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('adminSession')
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    if (!sessionData.userId || !sessionData.role) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Check if user is ADMIN
    if (sessionData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const phone = formData.get('phone') as string | null
    const position = formData.get('position') as string | null
    const joiningDate = formData.get('joiningDate') as string | null
    const status = formData.get('status') as string | null
    const permissions = formData.get('permissions') as string | null
    const profileImage = formData.get('profileImage') as File | null

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Handle profile image upload to Cloudinary
    let profileImageUrl: string | null = null
    if (profileImage) {
      try {
        const { uploadImage } = await import('@/lib/cloudinary')
        const uploadResult = await uploadImage(profileImage, 'staff-profiles')
        profileImageUrl = uploadResult.url
      } catch (error) {
        console.error('Error uploading profile image:', error)
        return NextResponse.json(
          { error: 'Failed to upload profile image' },
          { status: 500 }
        )
      }
    }

    // Parse permissions
    let permissionsArray: string[] = []
    if (permissions) {
      try {
        permissionsArray = JSON.parse(permissions)
      } catch (error) {
        console.error('Error parsing permissions:', error)
      }
    }

    // Create new staff member (role is always STAFF)
    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role: $Enums.UserRole.STAFF,
        position: position ? position.toUpperCase() as any : null,
        profileImage: profileImageUrl,
        joiningDate: joiningDate ? new Date(joiningDate) : null,
        status: status ? status.toUpperCase() as any : 'ACTIVE',
        permissions: permissionsArray
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        position: true,
        profileImage: true,
        joiningDate: true,
        status: true,
        permissions: true,
        createdAt: true
      }
    })

    return NextResponse.json(newStaff, { status: 201 })
  } catch (error) {
    console.error('Error creating staff:', error)
    console.error('Error type:', typeof error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'An error occurred while creating staff', details: errorMessage },
      { status: 500 }
    )
  }
}
