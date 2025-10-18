'use server';

import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserProfile(userId: string) {
  try {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    return { profile, error: null };
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return { profile: null, error: error.message };
  }
}

export async function createUserProfile(data: {
  id: string;
  email: string;
  fullName: string;
  userType: 'deaf' | 'company';
  rslProficiencyLevel?: string;
  companyName?: string;
  industry?: string;
  industryOther?: string;
  role?: string;
  roleOther?: string;
}) {
  try {
    await db.insert(profiles).values(data);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error creating profile:', error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(userId: string, data: Partial<{
  fullName: string;
  rslProficiencyLevel: string;
  companyName: string;
  industry: string;
  role: string;
}>) {
  try {
    await db
      .update(profiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, userId));

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
}