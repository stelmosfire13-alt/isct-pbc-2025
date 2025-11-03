import imageCompression from 'browser-image-compression'

const MAX_IMAGE_SIZE = 20 * 1024 * 1024 // 20MB in bytes
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

/**
 * Compress an image file for upload
 * @param file - The image file to compress
 * @returns Compressed image file
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Maximum size in MB
    maxWidthOrHeight: 1920, // Maximum width or height
    useWebWorker: true, // Use web worker for better performance
    fileType: file.type as 'image/jpeg' | 'image/png', // Preserve original format
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('Image compression failed:', error)
    // Return original file if compression fails
    return file
  }
}

/**
 * Validate image file type
 * @param file - The file to validate
 * @returns True if valid, false otherwise
 */
export function validateImageType(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type)
}

/**
 * Validate image file size
 * @param file - The file to validate
 * @returns True if valid, false otherwise
 */
export function validateImageSize(file: File): boolean {
  return file.size <= MAX_IMAGE_SIZE
}

/**
 * Generate a storage path for an uploaded image
 * @param userId - The user ID
 * @param filename - The original filename
 * @returns Storage path in format: user_id/pets/uuid-filename
 */
export function generateStoragePath(userId: string, filename: string): string {
  // Generate a UUID v4 (simplified version)
  const uuid = crypto.randomUUID()

  // Sanitize filename - remove special characters except extension
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')

  return `${userId}/pets/${uuid}-${sanitizedFilename}`
}

/**
 * Get file extension from filename
 * @param filename - The filename
 * @returns File extension with dot (e.g., ".jpg")
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return ''
  return filename.substring(lastDot)
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get the public URL for a pet image from Supabase Storage
 * @param imagePath - The storage path of the image (from pet.imagePath)
 * @returns Public URL or null if no image path provided
 */
export function getPetImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not defined')
    return null
  }

  return `${supabaseUrl}/storage/v1/object/public/pet-images/${imagePath}`
}
