-- ID público (UUID) para usuarios y familias. La clave interna (id entero) no cambia ni se reemplaza:
-- sigue siendo la que usan las relaciones, la sesión y los demás servicios.
-- gen_random_uuid() es nativa de PostgreSQL 13+; las filas existentes reciben cada una su propio UUID.

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "familia" ADD COLUMN "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_uuid_key" ON "usuarios"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "familia_uuid_key" ON "familia"("uuid");
