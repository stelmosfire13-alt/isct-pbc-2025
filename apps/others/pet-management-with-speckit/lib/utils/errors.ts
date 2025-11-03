/**
 * Maps technical errors to user-friendly messages
 * Never exposes stack traces or technical details to users (FR-021)
 */

export function getUserFriendlyErrorMessage(error: unknown): string {
  // Handle Supabase Auth errors
  if (isSupabaseError(error)) {
    return getSupabaseErrorMessage(error)
  }

  // Handle Prisma errors
  if (isPrismaError(error)) {
    return getPrismaErrorMessage(error)
  }

  // Handle validation errors (Zod)
  if (isValidationError(error)) {
    return 'Please check your input and try again.'
  }

  // Default fallback
  return 'Something went wrong. Please try again later.'
}

function isSupabaseError(error: unknown): error is { message: string; status?: number } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

function getSupabaseErrorMessage(error: { message: string; status?: number }): string {
  const message = error.message.toLowerCase()

  // Authentication errors
  if (message.includes('invalid login credentials')) {
    return 'Email or password is incorrect'
  }
  if (message.includes('email already registered') || message.includes('already been registered')) {
    return 'An account with this email already exists'
  }
  if (message.includes('email not confirmed')) {
    return 'Please confirm your email address'
  }
  if (message.includes('invalid email')) {
    return 'Please enter a valid email address'
  }

  // Storage errors
  if (message.includes('payload too large') || message.includes('file too large')) {
    return 'File is too large. Maximum size is 20MB'
  }
  if (message.includes('invalid file type')) {
    return 'Only JPEG and PNG files are supported'
  }

  // Default Supabase error
  return 'An error occurred. Please try again.'
}

function isPrismaError(error: unknown): error is { code: string; meta?: any } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as any).code === 'string'
  )
}

function getPrismaErrorMessage(error: { code: string; meta?: any }): string {
  switch (error.code) {
    case 'P2002':
      return 'This record already exists'
    case 'P2025':
      return 'Record not found'
    case 'P2003':
      return 'Related record not found'
    case 'P2001':
      return 'Record does not exist'
    default:
      return 'Database error. Please try again.'
  }
}

function isValidationError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('issues' in error || 'errors' in error)
  )
}

/**
 * Logs error details server-side for debugging
 * Never expose these logs to the client
 */
export function logError(error: unknown, context?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error)
  }
  // In production, you would send this to a logging service
  // e.g., Sentry, LogRocket, etc.
}
