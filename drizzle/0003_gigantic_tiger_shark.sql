CREATE TABLE "deep_dive_insights" (
	"id" text PRIMARY KEY NOT NULL,
	"deep_dive_id" text NOT NULL,
	"text" text NOT NULL,
	"source_message_index" integer NOT NULL,
	"value_tags" jsonb NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deep_dive_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"deep_dive_id" text NOT NULL,
	"message_index" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"tool_calls" jsonb,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deep_dives" (
	"id" text PRIMARY KEY NOT NULL,
	"mission_id" text NOT NULL,
	"session_id" text,
	"child_id" text NOT NULL,
	"expert" jsonb NOT NULL,
	"real_world_case" jsonb NOT NULL,
	"portfolio_entry" text,
	"status" text DEFAULT 'active' NOT NULL,
	"agent_state" jsonb NOT NULL,
	"started_at" text NOT NULL,
	"completed_at" text,
	"created_at" text NOT NULL
);
