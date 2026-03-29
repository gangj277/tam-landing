CREATE TABLE "children" (
	"id" text PRIMARY KEY NOT NULL,
	"family_id" text NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"avatar_seed" text NOT NULL,
	"is_default" boolean NOT NULL,
	"onboarded_at" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_email" text NOT NULL,
	"owner_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"parent_pin_hash" text NOT NULL,
	"active_child_id" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_devices" (
	"id" text PRIMARY KEY NOT NULL,
	"family_id" text NOT NULL,
	"device_id" text NOT NULL,
	"created_at" text NOT NULL,
	"last_seen_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mirrors" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"child_id" text NOT NULL,
	"mission_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mission_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"child_id" text NOT NULL,
	"assignment_date" text NOT NULL,
	"mission_id" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "missions" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"difficulty" text NOT NULL,
	"is_active" boolean NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"child_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"recalculated_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_epilogues" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_generated_rounds" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"round_index" integer NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_reactions" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"round_index" integer NOT NULL,
	"emotion_id" text NOT NULL,
	"emotion_label" text NOT NULL,
	"method_id" text NOT NULL,
	"method_label" text NOT NULL,
	"value_tags" jsonb NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_thinking_tool_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"round_index" integer NOT NULL,
	"tool_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_tool_usages" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"round_index" integer NOT NULL,
	"tool_type" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"child_id" text NOT NULL,
	"mission_id" text NOT NULL,
	"status" text NOT NULL,
	"started_at" text NOT NULL,
	"completed_at" text,
	"initial_choice_id" text,
	"initial_choice_label" text,
	"reflection_note" text,
	"closing_response" text,
	"mirror_id" text,
	"expires_at" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"child_id" text NOT NULL,
	"week_start" text NOT NULL,
	"week_end" text NOT NULL,
	"payload" jsonb NOT NULL,
	"guide_comment" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
