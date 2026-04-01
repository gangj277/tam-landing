import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const families = pgTable("families", {
  id: text("id").primaryKey(),
  ownerPhone: text("owner_phone").notNull(),
  ownerName: text("owner_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  parentPinHash: text("parent_pin_hash").notNull(),
  activeChildId: text("active_child_id").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const familyDevices = pgTable("family_devices", {
  id: text("id").primaryKey(),
  familyId: text("family_id").notNull(),
  deviceId: text("device_id").notNull(),
  createdAt: text("created_at").notNull(),
  lastSeenAt: text("last_seen_at").notNull(),
});

export const children = pgTable("children", {
  id: text("id").primaryKey(),
  familyId: text("family_id").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  avatarSeed: text("avatar_seed").notNull(),
  isDefault: boolean("is_default").notNull(),
  onboardedAt: text("onboarded_at"),
  createdAt: text("created_at").notNull(),
});

export const missions = pgTable("missions", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  isActive: boolean("is_active").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: text("created_at").notNull(),
});

export const missionAssignments = pgTable("mission_assignments", {
  id: text("id").primaryKey(),
  childId: text("child_id").notNull(),
  assignmentDate: text("assignment_date").notNull(),
  missionId: text("mission_id").notNull(),
  reason: text("reason").notNull(),
  createdAt: text("created_at").notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  childId: text("child_id").notNull(),
  missionId: text("mission_id").notNull(),
  status: text("status").notNull(),
  startedAt: text("started_at").notNull(),
  completedAt: text("completed_at"),
  initialChoiceId: text("initial_choice_id"),
  initialChoiceLabel: text("initial_choice_label"),
  reflectionNote: text("reflection_note"),
  closingResponse: text("closing_response"),
  mirrorId: text("mirror_id"),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sessionReactions = pgTable("session_reactions", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  roundIndex: integer("round_index").notNull(),
  emotionId: text("emotion_id").notNull(),
  emotionLabel: text("emotion_label").notNull(),
  methodId: text("method_id").notNull(),
  methodLabel: text("method_label").notNull(),
  valueTags: jsonb("value_tags").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sessionToolUsages = pgTable("session_tool_usages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  roundIndex: integer("round_index").notNull(),
  toolType: text("tool_type").notNull(),
  createdAt: text("created_at").notNull(),
});

export const sessionGeneratedRounds = pgTable("session_generated_rounds", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  roundIndex: integer("round_index").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sessionThinkingToolCards = pgTable("session_thinking_tool_cards", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  roundIndex: integer("round_index").notNull(),
  toolType: text("tool_type").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sessionEpilogues = pgTable("session_epilogues", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const mirrors = pgTable("mirrors", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  childId: text("child_id").notNull(),
  missionId: text("mission_id").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: text("created_at").notNull(),
});

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  childId: text("child_id").notNull(),
  payload: jsonb("payload").notNull(),
  recalculatedAt: text("recalculated_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const dailyChoiceSets = pgTable("daily_choice_sets", {
  id: text("id").primaryKey(),
  childId: text("child_id").notNull(),
  choiceDate: text("choice_date").notNull(),
  previews: jsonb("previews").notNull(),
  chosenIndex: integer("chosen_index"),
  chosenMissionId: text("chosen_mission_id"),
  strategy: jsonb("strategy").notNull(),
  createdAt: text("created_at").notNull(),
  chosenAt: text("chosen_at"),
});

export const weeklyReports = pgTable("weekly_reports", {
  id: text("id").primaryKey(),
  childId: text("child_id").notNull(),
  weekStart: text("week_start").notNull(),
  weekEnd: text("week_end").notNull(),
  payload: jsonb("payload").notNull(),
  guideComment: text("guide_comment").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Deep-Dive v2 Tables ───

export const deepDives = pgTable("deep_dives", {
  id: text("id").primaryKey(),
  missionId: text("mission_id").notNull(),
  sessionId: text("session_id"),
  childId: text("child_id").notNull(),
  expert: jsonb("expert").notNull(),
  realWorldCase: jsonb("real_world_case").notNull(),
  portfolioEntry: text("portfolio_entry"),
  status: text("status").notNull(),
  startedAt: text("started_at").notNull(),
  completedAt: text("completed_at"),
  createdAt: text("created_at").notNull(),
});

export const deepDiveTurns = pgTable("deep_dive_turns", {
  id: text("id").primaryKey(),
  deepDiveId: text("deep_dive_id").notNull(),
  turnIndex: integer("turn_index").notNull(),
  type: text("type").notNull(),
  expertMessage: text("expert_message"),
  interactionType: text("interaction_type").notNull(),
  options: jsonb("options"),
  selectedOptionId: text("selected_option_id"),
  textResponse: text("text_response"),
  createdAt: text("created_at").notNull(),
});
