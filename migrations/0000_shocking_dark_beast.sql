CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"author" text NOT NULL,
	"published_at" timestamp NOT NULL,
	"read_time" integer NOT NULL,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"duration" integer NOT NULL,
	"question_count" integer NOT NULL,
	"color" text NOT NULL,
	"icon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"question" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_answer" text NOT NULL,
	"explanation" text
);
--> statement-breakpoint
CREATE TABLE "test_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"category_id" integer NOT NULL,
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"feedback" text,
	"completed_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "video_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"scenario" text NOT NULL,
	"overall_score" integer NOT NULL,
	"eye_contact_score" integer NOT NULL,
	"facial_expression_score" integer NOT NULL,
	"gesture_score" integer NOT NULL,
	"posture_score" integer NOT NULL,
	"feedback" jsonb NOT NULL,
	"created_at" timestamp NOT NULL
);
