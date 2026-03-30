CREATE TABLE "daily_choice_sets" (
	"id" text PRIMARY KEY NOT NULL,
	"child_id" text NOT NULL,
	"choice_date" text NOT NULL,
	"previews" jsonb NOT NULL,
	"chosen_index" integer,
	"chosen_mission_id" text,
	"strategy" jsonb NOT NULL,
	"created_at" text NOT NULL,
	"chosen_at" text
);
