-- Nombre y apellido del usuario. Columnas opcionales: "username" se mantiene por compatibilidad con back-transaction,
-- back-nest y los correos, que todavía lo leen. Es idempotente (IF NOT EXISTS / WHERE ... IS NULL).
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "nombre" VARCHAR(80);
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "apellido" VARCHAR(80);

-- Los usuarios que ya existían: su nombre es el username que tenían; el apellido queda vacío.
UPDATE "usuarios" SET "nombre" = "username" WHERE "nombre" IS NULL;
