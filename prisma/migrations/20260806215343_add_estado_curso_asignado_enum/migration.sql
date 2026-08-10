/*
  Warnings:

  - The `estado` column on the `cursoasignado` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EstadoCursoAsignado" AS ENUM ('ACTIVO', 'COMPLETADO', 'CANCELADO');

-- AlterTable
ALTER TABLE "cursoasignado" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoCursoAsignado" NOT NULL DEFAULT 'ACTIVO';
