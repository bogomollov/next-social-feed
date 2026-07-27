CREATE TABLE "post_repost" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_repost" ADD CONSTRAINT "post_repost_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_repost" ADD CONSTRAINT "post_repost_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "post_repost_post_user_unique" ON "post_repost" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX "post_repost_post_id_idx" ON "post_repost" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_repost_user_id_idx" ON "post_repost" USING btree ("user_id");