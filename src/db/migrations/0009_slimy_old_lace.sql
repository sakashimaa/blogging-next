CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'moderator');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'user' NOT NULL;