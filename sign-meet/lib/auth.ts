import { supabase } from './supabase';
import { db } from './db';
import { profiles } from './db/schema';
import { eq } from 'drizzle-orm';

// Use Supabase Auth for authentication
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Use Drizzle for database queries
export async function getCurrentUserProfile() {
  const user = await getCurrentUser();
  
  if (!user) return null;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  return profile;
}

export async function getUserType() {
  const profile = await getCurrentUserProfile();
  return profile?.userType;
}

// Use Supabase Auth for sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}