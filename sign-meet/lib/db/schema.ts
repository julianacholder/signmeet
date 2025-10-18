// lib/db/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email'),
  fullName: text('full_name'),
  userType: text('user_type').notNull(),
  
  // Deaf professional fields
  rslProficiencyLevel: text('rsl_proficiency_level'),
  
  // Company fields
  companyName: text('company_name'),
  industry: text('industry'),
  industryOther: text('industry_other'),
  role: text('role'),
  roleOther: text('role_other'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;