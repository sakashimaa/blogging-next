CREATE TABLE "blog_favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_favorites_blog_id_user_id_unique" UNIQUE("blog_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "blog_favorites" ADD CONSTRAINT "blog_favorites_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;