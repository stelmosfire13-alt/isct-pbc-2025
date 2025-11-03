/**
 * Type definitions for application models
 */

/**
 * User model representing an authenticated user
 */
export interface User {
  id: string
  email: string
  createdAt: Date
}

/**
 * Authentication response returned from auth actions
 */
export interface AuthResponse {
  success: boolean
  error?: string
  user?: User
}

/**
 * Authentication error types
 */
export type AuthError =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'INVALID_EMAIL'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

/**
 * Auth action state for form handling
 */
export interface AuthActionState {
  error?: string
  success?: boolean
}
