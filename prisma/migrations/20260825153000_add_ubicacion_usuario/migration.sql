-- CreateTable
CREATE TABLE "ubicacion_usuario" (
    "id" SERIAL NOT NULL,
    "idusuario" INTEGER NOT NULL,
    "idpais" INTEGER,
    "ciudad" VARCHAR(100),
    "zonaHoraria" VARCHAR(100),
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ubicacion_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ubicacion_usuario_idusuario_key" ON "ubicacion_usuario"("idusuario");

-- CreateIndex
CREATE INDEX "ubicacion_usuario_idpais_idx" ON "ubicacion_usuario"("idpais");

-- AddForeignKey
ALTER TABLE "ubicacion_usuario" ADD CONSTRAINT "fk_ubicacion_usuario_usuario" FOREIGN KEY ("idusuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ubicacion_usuario" ADD CONSTRAINT "fk_ubicacion_usuario_pais" FOREIGN KEY ("idpais") REFERENCES "pais"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
