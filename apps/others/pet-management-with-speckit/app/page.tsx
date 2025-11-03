import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect authenticated users to pets page
  if (user) {
    redirect('/pets')
  }

  // Redirect unauthenticated users to login
  redirect('/login')
}
