CREATE TABLE "post_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_id" uuid,
	"author_name" varchar(255) NOT NULL,
	"author_handle" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_comment_post_id_idx" ON "post_comment" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_comment_author_id_idx" ON "post_comment" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "post_comment_created_at_idx" ON "post_comment" USING btree ("created_at");