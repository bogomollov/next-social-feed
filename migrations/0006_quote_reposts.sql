ALTER TABLE "post_repost" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "post_repost" CASCADE;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "repost_of_id" uuid;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "repost_of_author_name" varchar(255);--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "repost_of_author_handle" varchar(255);--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "repost_of_content" text;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_repost_of_id_post_id_fk" FOREIGN KEY ("repost_of_id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_repost_of_id_idx" ON "post" USING btree ("repost_of_id");