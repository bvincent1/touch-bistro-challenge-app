CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"index" integer DEFAULT 0,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"correct_answer" text NOT NULL,
	"test_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_test_id_quizzes_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."quizzes"("id") ON DELETE no action ON UPDATE no action;