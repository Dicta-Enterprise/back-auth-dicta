/*
  Warnings:

  - You are about to drop the column `cambiarAvatar` on the `permisoCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `interaccionComunidad` on the `permisoCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `verAlias` on the `permisoCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `verCertificaciones` on the `permisoCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `verPerfil` on the `permisoCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `verProgreso` on the `permisoCuenta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "permisoCuenta" DROP COLUMN "cambiarAvatar",
DROP COLUMN "interaccionComunidad",
DROP COLUMN "verAlias",
DROP COLUMN "verCertificaciones",
DROP COLUMN "verPerfil",
DROP COLUMN "verProgreso",
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "horarioFin" TEXT,
ADD COLUMN     "horarioInicio" TEXT,
ADD COLUMN     "puedeComprarCursos" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "puedeDescargarMaterial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "puedeUsarChat" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "puedeVerCertificados" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "puedeVerCursos" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "puedeVerProgreso" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tiempoMaximoDiario" INTEGER;
