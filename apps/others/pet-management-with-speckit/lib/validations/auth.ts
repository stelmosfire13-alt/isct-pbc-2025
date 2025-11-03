import { z } from 'zod'

/**
 * Validation schema for user registration
 * Requirements:
 * - Email must be valid format
 * - Password must be at least 8 characters
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
})

/**
 * Validation schema for user login
 * Requirements:
 * - Email must be valid format
 * - Password is required (no min length check on login)
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Type inference from schemas
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
