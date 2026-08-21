import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
}

export async function uploadImage(
  file: File,
  folder: string = 'cafe-website'
): Promise<UploadResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1200, height: 800, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format
            })
          } else {
            reject(new Error('Unknown error uploading image'))
          }
        }
      ).end(buffer)
    })
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw new Error('Failed to delete image')
  }
}

export function getPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const filename = pathParts[pathParts.length - 1]
    const publicId = filename.split('.')[0]
    const folder = pathParts.slice(-2, -1).join('/')
    return `${folder}/${publicId}`
  } catch {
    return null
  }
}
