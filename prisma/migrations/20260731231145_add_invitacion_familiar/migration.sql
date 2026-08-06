-- CreateEnum
CREATE TYPE "EstadoInvitacion" AS ENUM ('PENDIENTE', 'ACEPTADA', 'EXPIRADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "invitacionfamiliar" (
    "id" SERIAL NOT NULL,
    "idpadre" INTEGER NOT NULL,
    "correo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "fechanacimiento" TIMESTAMP(3) NOT NULL,
    "tipocuenta" "TipoCuentaFamiliar" NOT NULL,
    "token" TEXT NOT NULL,
    "estado" "EstadoInvitacion" NOT NULL DEFAULT 'PENDIENTE',
    "fechaexpiracion" TIMESTAMP(3) NOT NULL,
    "fechaaceptacion" TIMESTAMP(3),
    "fechacreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitacionfamiliar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitacionfamiliar_token_key" ON "invitacionfamiliar"("token");

-- CreateIndex
CREATE INDEX "invitacionfamiliar_correo_idx" ON "invitacionfamiliar"("correo");

-- CreateIndex
CREATE INDEX "invitacionfamiliar_token_idx" ON "invitacionfamiliar"("token");

-- AddForeignKey
ALTER TABLE "invitacionfamiliar" ADD CONSTRAINT "invitacionfamiliar_idpadre_fkey" FOREIGN KEY ("idpadre") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
