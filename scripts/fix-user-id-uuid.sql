-- One-off repair: convert public."user".id integer (serial) -> uuid
-- Preserves rows by issuing fresh UUIDs. Safe because all child FK tables
-- are currently empty (verified 2026-09-04). If child rows existed, they
-- would need remapping via a user_id_map temp table before the swap.
-- Run directly with psql, NOT via drizzle-kit migrate.
BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Add new uuid column, backfilled for existing rows (2 users)
ALTER TABLE "public"."user" ADD COLUMN IF NOT EXISTS "id_new" uuid NOT NULL DEFAULT gen_random_uuid();

-- 2. Drop PK on old integer id (no FKs reference it - verified via pg_constraint)
ALTER TABLE "public"."user" DROP CONSTRAINT IF EXISTS "user_pkey";

-- 3. Detach sequence from old column, then drop it
ALTER TABLE "public"."user" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE IF EXISTS "public"."user_user_id_seq";

-- 4. Swap columns
ALTER TABLE "public"."user" DROP COLUMN "id";
ALTER TABLE "public"."user" RENAME COLUMN "id_new" TO "id";

-- 5. Restore PK + default matching db/schema.ts
ALTER TABLE "public"."user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

COMMIT;
