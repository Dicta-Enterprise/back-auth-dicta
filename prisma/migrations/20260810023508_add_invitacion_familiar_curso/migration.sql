-- CreateTable
CREATE TABLE "InvitacionFamiliar" (
    "id" TEXT NOT NULL,
    "idCuentaAsociada" INTEGER NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "token" TEXT NOT NULL,
    "estado" "EstadoInvitacion" NOT NULL DEFAULT 'PENDIENTE',
    "cursoId" CHAR(24) NOT NULL,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "fechaAceptacion" TIMESTAMP(3),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvitacionFamiliar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvitacionFamiliar_token_key" ON "InvitacionFamiliar"("token");

-- CreateIndex
CREATE INDEX "InvitacionFamiliar_correo_idx" ON "InvitacionFamiliar"("correo");

-- AddForeignKey
ALTER TABLE "InvitacionFamiliar" ADD CONSTRAINT "fk_invitacionFamiliar_cuentaAsociada" FOREIGN KEY ("idCuentaAsociada") REFERENCES "cuenta_asociada"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
