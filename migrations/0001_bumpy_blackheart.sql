ALTER TABLE "participants" ALTER COLUMN "created_at" SET DATA TYPE varchar(14);--> statement-breakpoint
ALTER TABLE "participants" ALTER COLUMN "created_at" SET DEFAULT TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "created_at" SET DATA TYPE varchar(14);--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "created_at" SET DEFAULT TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "transaction_date" SET DATA TYPE varchar(14);--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "transaction_date" SET DEFAULT '';