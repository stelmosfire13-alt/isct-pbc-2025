import { z } from 'zod'

const MAX_IMAGE_SIZE = 20 * 1024 * 1024 // 20MB in bytes
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const petSchema = z.object({
  name: z
    .string()
    .min(1, 'Pet name is required')
    .max(50, 'Pet name must be less than 50 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  birthday: z
    .date()
    .max(new Date(), 'Birthday cannot be in the future')
    .refine(
      (date) => date.getFullYear() >= 1900,
      'Birthday must be after year 1900'
    ),
  gender: z.enum(['male', 'female'], {
    required_error: 'Gender is required',
    invalid_type_error: 'Gender must be either male or female',
  }),
  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        // Skip validation if no file or not a File object
        if (!file || typeof file !== 'object') return true
        if (typeof File !== 'undefined' && !(file instanceof File)) return true
        return file.size <= MAX_IMAGE_SIZE
      },
      `Image size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
    )
    .refine(
      (file) => {
        // Skip validation if no file or not a File object
        if (!file || typeof file !== 'object') return true
        if (typeof File !== 'undefined' && !(file instanceof File)) return true
        return ACCEPTED_IMAGE_TYPES.includes(file.type)
      },
      'Image must be JPEG or PNG format'
    ),
})

export type PetInput = z.infer<typeof petSchema>

// For editing pets - all fields optional except any that need validation
export const updatePetSchema = petSchema.partial()

export type UpdatePetInput = z.infer<typeof updatePetSchema>
