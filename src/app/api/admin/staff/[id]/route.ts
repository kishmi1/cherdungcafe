import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { $Enums } from '@/generated/prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const staffId = parseInt(id)

    // Get staff member
    const staff = await prisma.user.findUnique({
      where: { id: staffId },
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

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 })
    }

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching staff member:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching staff member' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const phone = formData.get('phone') as string | null
    const position = formData.get('position') as string | null
    const joiningDate = formData.get('joiningDate') as string | null
    const status = formData.get('status') as string | null
    const permissions = formData.get('permissions') as string | null
    const profileImage = formData.get('profileImage') as File | null
    
    const { id } = await params
    const staffId = parseInt(id)

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser && existingUser.id !== staffId) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      )
    }

    // Handle profile image upload to Cloudinary if provided
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
    let permissionsArray: string[] | undefined
    if (permissions) {
      try {
        permissionsArray = JSON.parse(permissions)
      } catch (error) {
        console.error('Error parsing permissions:', error)
      }
    }

    // Build update data object
    const updateData: any = {
      name,
      email,
      phone: phone || null,
      position: position ? position.toUpperCase() as any : null,
      joiningDate: joiningDate ? new Date(joiningDate) : null,
      status: status ? status.toUpperCase() as any : undefined,
    }

    // Only update profile image if a new one was uploaded
    if (profileImageUrl) {
      updateData.profileImage = profileImageUrl
    }

    // Only update permissions if provided
    if (permissionsArray) {
      updateData.permissions = permissionsArray
    }

    // Update staff (cannot change role)
    const updatedStaff = await prisma.user.update({
      where: { id: staffId },
      data: updateData,
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
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedStaff)
  } catch (error) {
    console.error('Error updating staff:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating staff' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const staffId = parseInt(id)

    // Prevent admin from deleting themselves
    if (staffId === sessionData.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Get staff member to delete profile image from Cloudinary
    const staff = await prisma.user.findUnique({
      where: { id: staffId },
      select: { profileImage: true }
    })

    if (staff?.profileImage) {
      try {
        const { getPublicIdFromUrl, deleteImage } = await import('@/lib/cloudinary')
        const publicId = getPublicIdFromUrl(staff.profileImage)
        if (publicId) {
          await deleteImage(publicId)
        }
      } catch (error) {
        console.error('Error deleting profile image from Cloudinary:', error)
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete staff member
    await prisma.user.delete({
      where: { id: staffId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting staff:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting staff' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { status } = await request.json()
    const { id } = await params
    const staffId = parseInt(id)

    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Update staff status
    const updatedStaff = await prisma.user.update({
      where: { id: staffId },
      data: {
        status: status as any
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

    return NextResponse.json(updatedStaff)
  } catch (error) {
    console.error('Error updating staff status:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating staff status' },
      { status: 500 }
    )
  }
}
