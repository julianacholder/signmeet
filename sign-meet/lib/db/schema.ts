import { pgTable, text, timestamp, uuid, boolean, varchar, integer } from 'drizzle-orm/pg-core';


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

// Calendar connections table
export const calendarConnections = pgTable('calendar_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull().default('google'),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  tokenExpiry: timestamp('token_expiry', { withTimezone: true }).notNull(),
  email: varchar('email', { length: 255 }),
  connected: boolean('connected').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Interviews table
export const interviews = pgTable('interviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  meetingId: varchar('meeting_id', { length: 100 }),
  meetingLink: text('meeting_link'),
  passcode: varchar('passcode', { length: 50 }),
  type: varchar('type', { length: 50 }).default('RSL Translation Active'),
  
  // Multi-tenant support
  candidateId: uuid('candidate_id').references(() => profiles.id, { onDelete: 'cascade' }),
  interviewerId: uuid('interviewer_id').references(() => profiles.id, { onDelete: 'cascade' }),
  
  // Calendar sync
  googleEventId: varchar('google_event_id', { length: 255 }),
  syncedToCalendar: boolean('synced_to_calendar').default(false),
  
  status: varchar('status', { length: 50 }).default('scheduled'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}); 

// Meeting participants table (separate table!)
export const meetingParticipants = pgTable('meeting_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  interviewId: uuid('interview_id').references(() => interviews.id, { onDelete: 'cascade' }).notNull(),
  
  // Either a registered user OR a guest
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  guestEmail: text('guest_email'),
  guestName: text('guest_name'),
  
  role: text('role').notNull().default('participant'), 
  status: text('status').notNull().default('invited'), 
  
  joinedAt: timestamp('joined_at', { withTimezone: true }),
  leftAt: timestamp('left_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Call sessions table (tracks individual join/leave events)
export const callSessions = pgTable('call_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Meeting reference
  meetingId: varchar('meeting_id', { length: 100 }).notNull(),
  interviewId: uuid('interview_id').references(() => interviews.id, { onDelete: 'cascade' }),
  
  // Participant info
  // ✅ FIXED: Made nullable to support guest users who don't have a profile
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }), // Removed .notNull()
  userName: text('user_name').notNull(), // ✅ ADDED: .notNull() since we always need a display name
  userRole: varchar('user_role', { length: 50 }), // 'candidate' | 'interviewer' | 'guest'
  
  // Session timing
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull(),
  leftAt: timestamp('left_at', { withTimezone: true }),
  duration: integer('duration'), // In seconds, calculated when leftAt is set
  
  // Connection info
  disconnectReason: varchar('disconnect_reason', { length: 50 }), 
  // 'left_intentionally' | 'connection_lost' | 'tab_closed' | 'kicked' | 'idle_timeout'
  
  peerId: text('peer_id'), // PeerJS peer ID for this session
  
  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type CalendarConnection = typeof calendarConnections.$inferSelect;
export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;
export type MeetingParticipant = typeof meetingParticipants.$inferSelect;
export type NewMeetingParticipant = typeof meetingParticipants.$inferInsert;
export type CallSession = typeof callSessions.$inferSelect;
export type NewCallSession = typeof callSessions.$inferInsert;