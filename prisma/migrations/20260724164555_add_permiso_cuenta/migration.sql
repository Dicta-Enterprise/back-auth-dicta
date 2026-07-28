-- CreateEnum
CREATE TYPE "TipoCuentaFamiliar" AS ENUM ('NINO', 'JOVEN');

-- CreateEnum
CREATE TYPE "EstadoCuentaAsociada" AS ENUM ('ACTIVA', 'INACTIVA');

-- CreateTable
CREATE TABLE "cuenta_asociada" (
    "id" SERIAL NOT NULL,
    "idpadre" INTEGER NOT NULL,
    "idusuario" INTEGER NOT NULL,
    "tipocuenta" "TipoCuentaFamiliar" NOT NULL,
    "alias" VARCHAR(50),
    "estado" "EstadoCuentaAsociada" NOT NULL DEFAULT 'ACTIVA',
    "fechacreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cuenta_asociada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisoCuenta" (
    "id" SERIAL NOT NULL,
    "idCuentaAsociada" INTEGER NOT NULL,
    "verPerfil" BOOLEAN NOT NULL DEFAULT true,
    "verAlias" BOOLEAN NOT NULL DEFAULT true,
    "verCertificaciones" BOOLEAN NOT NULL DEFAULT true,
    "cambiarAvatar" BOOLEAN NOT NULL DEFAULT false,
    "verProgreso" BOOLEAN NOT NULL DEFAULT true,
    "interaccionComunidad" BOOLEAN NOT NULL DEFAULT false,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permisoCuenta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cuenta_asociada_idpadre_idx" ON "cuenta_asociada"("idpadre");

-- CreateIndex
CREATE INDEX "cuenta_asociada_idusuario_idx" ON "cuenta_asociada"("idusuario");

-- CreateIndex
CREATE UNIQUE INDEX "permisoCuenta_idCuentaAsociada_key" ON "permisoCuenta"("idCuentaAsociada");

-- AddForeignKey
ALTER TABLE "cuenta_asociada" ADD CONSTRAINT "fk_cuenta_asociada_usuarios" FOREIGN KEY ("idusuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permisoCuenta" ADD CONSTRAINT "fk_permisoCuenta_cuentaAsociada" FOREIGN KEY ("idCuentaAsociada") REFERENCES "cuenta_asociada"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
