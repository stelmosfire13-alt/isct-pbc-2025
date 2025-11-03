'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { registerSchema, loginSchema } from '@/lib/validations/auth'
import { getUserFriendlyErrorMessage } from '@/lib/utils/errors'
import type { AuthActionState } from '@/types/models'

/**
 * Register a new user account
 *
 * Flow:
 * 1. Validate input with Zod schema
 * 2. Call Supabase signUp
 * 3. Auto-login after successful registration
 * 4. Redirect to /pets
 *
 * @param prevState - Previous action state
 * @param formData - Form data containing email and password
 * @returns AuthActionState with error or success
 */
export async function register(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  try {
    // Extract and validate form data
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    const validatedData = registerSchema.parse(rawData)

    // Create Supabase client
    const supabase = await createClient()

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      console.error('Registration error:', error)
      return {
        error: getUserFriendlyErrorMessage(error),
        success: false,
      }
    }

    console.log('Registration data:', { user: data.user?.email, session: !!data.session })

    if (!data.user) {
      return {
        error: 'Registration failed. Please try again.',
        success: false,
      }
    }

    // Success - redirect to pets page
    // Note: Supabase auto-logs in the user after registration
  } catch (error) {
    return {
      error: getUserFriendlyErrorMessage(error),
      success: false,
    }
  }

  // Redirect must be outside try-catch as it throws
  redirect('/pets')
}

/**
 * Login an existing user
 *
 * Flow:
 * 1. Validate input with Zod schema
 * 2. Call Supabase signInWithPassword
 * 3. Create session (handled by Supabase)
 * 4. Redirect to redirect param or /pets
 *
 * @param prevState - Previous action state
 * @param formData - Form data containing email and password
 * @returns AuthActionState with error or success
 */
export async function login(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  try {
    // Extract and validate form data
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    const validatedData = loginSchema.parse(rawData)

    // Create Supabase client
    const supabase = await createClient()

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      console.error('Login error:', error)
      return {
        error: getUserFriendlyErrorMessage(error),
        success: false,
      }
    }

    if (!data.user) {
      return {
        error: 'Login failed. Please try again.',
        success: false,
      }
    }

    // Get redirect parameter (if exists)
    const redirectTo = formData.get('redirect') as string | null

    // Success - redirect to destination
    redirect(redirectTo || '/pets')
  } catch (error) {
    // Don't catch redirect errors
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    return {
      error: getUserFriendlyErrorMessage(error),
      success: false,
    }
  }
}

/**
 * Logout the current user
 *
 * Flow:
 * 1. Call Supabase signOut
 * 2. Clear cookies (handled by Supabase)
 * 3. Redirect to /login
 *
 * @returns void (redirects to /login)
 */
export async function logout(): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
    // Still redirect even if logout fails
  }

  redirect('/login')
}
