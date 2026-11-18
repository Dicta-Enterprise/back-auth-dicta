-- Tipo de usuario (FREE o PREMIUM) de la familia.
-- FREE hasta que el padre tenga al menos una compra COMPLETADA; entonces PREMIUM. Los hijos toman el de su familia.
-- Las filas existentes quedan en FREE; para marcar como PREMIUM a quienes ya compraron se usa
-- prisma/scripts/backfill-tipo-usuario-familia.sql (se ejecuta aparte, solo cuando se confirme).

-- AlterTable
ALTER TABLE "familia" ADD COLUMN "tipo_usuario" VARCHAR(10) NOT NULL DEFAULT 'FREE';

-- AddCheckConstraint
ALTER TABLE "familia" ADD CONSTRAINT "chk_familia_tipo_usuario" CHECK ("tipo_usuario" IN ('FREE', 'PREMIUM'));
