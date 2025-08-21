ALTER TABLE "blogs" DROP COLUMN "content";
ALTER TABLE "blogs" ADD COLUMN "content" jsonb;--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "title";