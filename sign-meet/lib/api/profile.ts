'use server';

import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getProfileDetails(userId: string) {
  try {
    const [profile] = await db
      .select({
        id: profiles.id,
        email: profiles.email,
        fullName: profiles.fullName,
        userType: profiles.userType,
        rslProficiencyLevel: profiles.rslProficiencyLevel,
        companyName: profiles.companyName,
        industry: profiles.industry,
        role: profiles.role,
        createdAt: profiles.createdAt,
      })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    return { profile, error: null };
  } catch (error: any) {
    return { profile: null, error: error.message };
  }
}

export async function getAllDeafProfessionals() {
  try {
    const deafProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userType, 'deaf'));

    return { profiles: deafProfiles, error: null };
  } catch (error: any) {
    return { profiles: null, error: error.message };
  }
}

export async function getAllCompanies() {
  try {
    const companies = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userType, 'company'));

    return { companies, error: null };
  } catch (error: any) {
    return { companies: null, error: error.message };
  }
}