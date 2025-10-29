import { supabase } from './supabase';

// Client-side auth functions that don't need database access
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  // Redirect to login page after successful logout
  window.location.href = '/auth/login';
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}