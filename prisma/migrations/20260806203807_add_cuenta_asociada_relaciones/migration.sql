/*
  Warnings:

  - A unique constraint covering the columns `[idinvitacion]` on the table `cuenta_asociada` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fechaaceptacion` on table `invitacionfamiliar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cuenta_asociada" ADD COLUMN     "fechanacimiento" TIMESTAMP(3),
ADD COLUMN     "idinvitacion" INTEGER,
ALTER COLUMN "idusuario" DROP NOT NULL;

-- AlterTable
ALTER TABLE "invitacionfamiliar" ALTER COLUMN "fechaaceptacion" SET NOT NULL;

-- CreateTable
CREATE TABLE "cursoasignado" (
    "id" SERIAL NOT NULL,
    "idcuentaasociada" INTEGER NOT NULL,
    "idcurso" CHAR(24) NOT NULL,
    "fechaasignacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "cursoasignado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cursoasignado_idcuentaasociada_idx" ON "cursoasignado"("idcuentaasociada");

-- CreateIndex
CREATE UNIQUE INDEX "cuenta_asociada_idinvitacion_key" ON "cuenta_asociada"("idinvitacion");

-- AddForeignKey
ALTER TABLE "cuenta_asociada" ADD CONSTRAINT "fk_cuenta_asociada_padre" FOREIGN KEY ("idpadre") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuenta_asociada" ADD CONSTRAINT "fk_cuenta_asociada_invitacion" FOREIGN KEY ("idinvitacion") REFERENCES "invitacionfamiliar"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cursoasignado" ADD CONSTRAINT "fk_cursoasignado_cuentaasociada" FOREIGN KEY ("idcuentaasociada") REFERENCES "cuenta_asociada"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
