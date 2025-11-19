import { supabase } from './supabase'
import { db } from './db'

// Alternative database operations using Supabase client
// This can be used as fallback or for specific Supabase features

export async function createSupabaseUser(userData: {
  email: string
  password: string
  name?: string
}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name
        }
      }
    })

    if (error) throw error
    
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export async function signInSupabaseUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    
    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    return { user: null, session: null, error: error.message }
  }
}

export async function signOutSupabaseUser() {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error: error.message }
  }
}

export async function getCurrentSupabaseUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (error) {
    return { user: null, error: error.message }
  }
}