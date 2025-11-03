'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { getUserFriendlyErrorMessage } from '@/lib/utils/errors'
import { petSchema } from '@/lib/validations/pet'
import { generateStoragePath } from '@/lib/utils/image'

export interface PetActionState {
  error?: string
  errors?: Record<string, string[]>
  success?: boolean
}

/**
 * Get all pets for the authenticated user
 *
 * Features:
 * - Verifies authentication
 * - Fetches pets owned by current user
 * - Pagination with limit of 20
 * - Ordered by createdAt descending (newest first)
 * - RLS ensures data isolation at database level
 *
 * @returns Array of pets or empty array
 */
export async function getPets() {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login?redirect=/pets')
    }

    // Fetch pets for the authenticated user
    const pets = await prisma.pet.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Pagination limit
    })

    return pets
  } catch (error) {
    console.error('Error fetching pets:', error)
    throw new Error(getUserFriendlyErrorMessage(error))
  }
}

/**
 * Get a single pet by ID
 *
 * Features:
 * - Verifies authentication
 * - Fetches specific pet by ID
 * - RLS ensures user can only access their own pets
 * - Returns null if pet not found or doesn't belong to user
 *
 * @param id - Pet ID (UUID)
 * @returns Pet object or null
 */
export async function getPet(id: string) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login?redirect=/pets/' + id)
    }

    // Fetch the pet
    const pet = await prisma.pet.findUnique({
      where: {
        id,
        userId: user.id, // Ensure ownership
      },
    })

    return pet
  } catch (error) {
    console.error('Error fetching pet:', error)
    throw new Error(getUserFriendlyErrorMessage(error))
  }
}

/**
 * Create a new pet
 *
 * Features:
 * - Verifies authentication
 * - Validates input with Zod schema
 * - Handles image upload to Supabase Storage
 * - Creates pet record in database with RLS
 * - Revalidates pet list page
 *
 * @param prevState - Previous form state
 * @param formData - Form data including pet details and optional image
 * @returns Action state with success or error information
 */
export async function createPet(
  prevState: PetActionState | null,
  formData: FormData
): Promise<PetActionState> {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login?redirect=/pets/new')
    }

    // Extract and prepare data
    const rawData = {
      name: formData.get('name'),
      category: formData.get('category'),
      birthday: formData.get('birthday')
        ? new Date(formData.get('birthday') as string)
        : null,
      gender: formData.get('gender'),
      image: formData.get('image'),
    }

    // Validate with Zod schema
    const validatedData = petSchema.parse(rawData)

    // Handle image upload if provided
    let imagePath: string | null = null
    if (validatedData.image && validatedData.image.size > 0) {
      const file = validatedData.image
      const storagePath = generateStoragePath(user.id, file.name)

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('pet-images')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Image upload error:', uploadError)
        return {
          error: 'Failed to upload image. Please try again.',
          success: false,
        }
      }

      imagePath = storagePath
    }

    // Create pet in database
    const pet = await prisma.pet.create({
      data: {
        userId: user.id,
        name: validatedData.name,
        category: validatedData.category,
        birthday: validatedData.birthday,
        gender: validatedData.gender,
        imagePath: imagePath,
      },
    })

    console.log('Pet created successfully:', { id: pet.id, name: pet.name })

    // Revalidate the pets list page
    revalidatePath('/pets')
  } catch (error) {
    console.error('Error creating pet:', error)

    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'errors' in error) {
      const zodError = error as { errors: Array<{ path: string[]; message: string }> }
      const fieldErrors: Record<string, string[]> = {}

      zodError.errors.forEach((err) => {
        const field = err.path.join('.')
        if (!fieldErrors[field]) {
          fieldErrors[field] = []
        }
        fieldErrors[field].push(err.message)
      })

      return {
        errors: fieldErrors,
        success: false,
      }
    }

    return {
      error: getUserFriendlyErrorMessage(error),
      success: false,
    }
  }

  // Redirect after successful creation (outside try-catch to let redirect error propagate)
  redirect('/pets')
}

/**
 * Update an existing pet
 *
 * Features:
 * - Verifies authentication and ownership
 * - Validates input with Zod schema (all fields optional)
 * - Handles image replacement (deletes old, uploads new)
 * - Handles image removal flag
 * - Updates pet record in database with RLS
 * - Revalidates pet list and detail pages
 *
 * @param id - Pet ID (UUID)
 * @param prevState - Previous form state
 * @param formData - Form data including updated fields and optional new image
 * @returns Action state with success or error information
 */
export async function updatePet(
  id: string,
  prevState: PetActionState | null,
  formData: FormData
): Promise<PetActionState> {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login?redirect=/pets/' + id + '/edit')
    }

    // Fetch existing pet to verify ownership and get current image path
    const existingPet = await prisma.pet.findUnique({
      where: {
        id,
        userId: user.id, // Ensure ownership
      },
    })

    if (!existingPet) {
      return {
        error: 'Pet not found or you do not have permission to edit it.',
        success: false,
      }
    }

    // Extract and prepare data
    const rawData = {
      name: formData.get('name'),
      category: formData.get('category'),
      birthday: formData.get('birthday')
        ? new Date(formData.get('birthday') as string)
        : null,
      gender: formData.get('gender'),
      image: formData.get('image'),
    }

    const removeImage = formData.get('removeImage') === 'true'

    // Validate with Zod schema (all fields optional for update)
    const validatedData = petSchema.partial().parse(rawData)

    // Handle image operations
    let newImagePath: string | null | undefined = undefined // undefined means no change

    // If user wants to remove the image
    if (removeImage && existingPet.imagePath) {
      // Delete old image from storage
      const { error: deleteError } = await supabase.storage
        .from('pet-images')
        .remove([existingPet.imagePath])

      if (deleteError) {
        console.error('Failed to delete old image:', deleteError)
        // Continue anyway - image removal is not critical
      }

      newImagePath = null // Set to null in database
    }
    // If user uploaded a new image
    else if (validatedData.image && validatedData.image.size > 0) {
      const file = validatedData.image

      // Delete old image if it exists
      if (existingPet.imagePath) {
        const { error: deleteError } = await supabase.storage
          .from('pet-images')
          .remove([existingPet.imagePath])

        if (deleteError) {
          console.error('Failed to delete old image:', deleteError)
          // Continue anyway - old image cleanup is not critical
        }
      }

      // Upload new image
      const storagePath = generateStoragePath(user.id, file.name)

      const { error: uploadError } = await supabase.storage
        .from('pet-images')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Image upload error:', uploadError)
        return {
          error: 'Failed to upload image. Please try again.',
          success: false,
        }
      }

      newImagePath = storagePath
    }

    // Prepare update data (only include fields that were provided)
    const updateData: any = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.category !== undefined)
      updateData.category = validatedData.category
    if (validatedData.birthday !== undefined)
      updateData.birthday = validatedData.birthday
    if (validatedData.gender !== undefined)
      updateData.gender = validatedData.gender
    if (newImagePath !== undefined) updateData.imagePath = newImagePath

    // Update pet in database
    const updatedPet = await prisma.pet.update({
      where: {
        id,
        userId: user.id, // Ensure ownership via RLS
      },
      data: updateData,
    })

    console.log('Pet updated successfully:', { id: updatedPet.id, name: updatedPet.name })

    // Revalidate both list and detail pages
    revalidatePath('/pets')
    revalidatePath('/pets/' + id)
  } catch (error) {
    console.error('Error updating pet:', error)

    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'errors' in error) {
      const zodError = error as { errors: Array<{ path: string[]; message: string }> }
      const fieldErrors: Record<string, string[]> = {}

      zodError.errors.forEach((err) => {
        const field = err.path.join('.')
        if (!fieldErrors[field]) {
          fieldErrors[field] = []
        }
        fieldErrors[field].push(err.message)
      })

      return {
        errors: fieldErrors,
        success: false,
      }
    }

    return {
      error: getUserFriendlyErrorMessage(error),
      success: false,
    }
  }

  // Redirect after successful update (outside try-catch to let redirect error propagate)
  redirect('/pets/' + id)
}

/**
 * Delete a pet
 *
 * Features:
 * - Verifies authentication and ownership
 * - Deletes pet image from storage if exists
 * - Deletes pet record from database with RLS
 * - Revalidates pet list page
 * - Redirects to pets list
 *
 * @param id - Pet ID (UUID)
 * @returns Never (redirects on success) or error state
 */
export async function deletePet(id: string): Promise<PetActionState> {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login?redirect=/pets')
    }

    // Fetch pet to verify ownership and get image path
    const pet = await prisma.pet.findUnique({
      where: {
        id,
        userId: user.id, // Ensure ownership
      },
    })

    if (!pet) {
      return {
        error: 'Pet not found or you do not have permission to delete it.',
        success: false,
      }
    }

    // Delete image from storage if exists
    if (pet.imagePath) {
      const { error: deleteImageError } = await supabase.storage
        .from('pet-images')
        .remove([pet.imagePath])

      if (deleteImageError) {
        console.error('Failed to delete pet image:', deleteImageError)
        // Continue with pet deletion even if image deletion fails
      }
    }

    // Delete pet from database
    await prisma.pet.delete({
      where: {
        id,
        userId: user.id, // Ensure ownership via RLS
      },
    })

    console.log('Pet deleted successfully:', { id: pet.id, name: pet.name })

    // Revalidate pets list page
    revalidatePath('/pets')
  } catch (error) {
    console.error('Error deleting pet:', error)
    return {
      error: getUserFriendlyErrorMessage(error),
      success: false,
    }
  }

  // Redirect after successful deletion (outside try-catch to let redirect error propagate)
  redirect('/pets')
}
