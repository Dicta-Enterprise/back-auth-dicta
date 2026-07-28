-- CreateTable
CREATE TABLE "accesos" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200),
    "estado" SMALLINT DEFAULT 1,

    CONSTRAINT "accesos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_accesos" (
    "id" SERIAL NOT NULL,
    "idrol" INTEGER NOT NULL,
    "idacceso" INTEGER NOT NULL,

    CONSTRAINT "detalle_accesos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departamento" (
    "id" SERIAL NOT NULL,
    "idpais" INTEGER NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "estado" SMALLINT NOT NULL DEFAULT 1,
    "fechacreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaactualizar" TIMESTAMP(6),

    CONSTRAINT "departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pais" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "estado" SMALLINT NOT NULL DEFAULT 1,
    "fechacreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaactualizar" TIMESTAMP(6),

    CONSTRAINT "pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfil" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50),
    "password" VARCHAR(255),
    "estado" SMALLINT,
    "imageurl" TEXT,
    "idusuario" INTEGER,
    "idrol" INTEGER,

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50),
    "apellidopat" VARCHAR(50),
    "apellidomat" VARCHAR(50),
    "documento" INTEGER,
    "telefono" INTEGER,
    "idusuario" INTEGER,
    "codigopostal" VARCHAR(10),
    "idpais" INTEGER,

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provincia" (
    "id" SERIAL NOT NULL,
    "iddepartamento" INTEGER NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "estado" SMALLINT NOT NULL DEFAULT 1,
    "fechacreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaactualizar" TIMESTAMP(6),

    CONSTRAINT "provincia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol" (
    "id" INTEGER NOT NULL,
    "nombrerol" VARCHAR(50),
    "estado" SMALLINT,
    "descripcion" VARCHAR(200),
    "tipo" VARCHAR(50),

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "auth_provider" VARCHAR(20) NOT NULL DEFAULT 'LOCAL',
    "password" VARCHAR(255),
    "fechadecreacion" TIMESTAMP(3),
    "estado" SMALLINT,
    "idrol" INTEGER DEFAULT 4,
    "googleId" TEXT,
    "terminos_condiciones" BOOLEAN NOT NULL DEFAULT false,
    "reset_code" VARCHAR(6),
    "reset_code_expires" TIMESTAMP(6),
    "reset_attempts" INTEGER NOT NULL DEFAULT 0,
    "verify_code" VARCHAR(6),
    "verify_code_expires" TIMESTAMP(6),
    "verify_attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permiso" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(200),
    "estado" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detallepermisos" (
    "id" SERIAL NOT NULL,
    "idrol" INTEGER NOT NULL,
    "idpermiso" INTEGER NOT NULL,
    "estado" SMALLINT NOT NULL DEFAULT 1,
    "fechacreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detallepermisos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accesos_codigo_key" ON "accesos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_accesos_idrol_idacceso_key" ON "detalle_accesos"("idrol", "idacceso");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_googleId_key" ON "usuarios"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "permiso_codigo_key" ON "permiso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "detallepermisos_idrol_idpermiso_key" ON "detallepermisos"("idrol", "idpermiso");

-- AddForeignKey
ALTER TABLE "detalle_accesos" ADD CONSTRAINT "detalle_accesos_idacceso_fkey" FOREIGN KEY ("idacceso") REFERENCES "accesos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_accesos" ADD CONSTRAINT "detalle_accesos_idrol_fkey" FOREIGN KEY ("idrol") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departamento" ADD CONSTRAINT "fk_departamento_pais" FOREIGN KEY ("idpais") REFERENCES "pais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfil" ADD CONSTRAINT "perfil_idrol_fkey" FOREIGN KEY ("idrol") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfil" ADD CONSTRAINT "perfil_idusuario_fkey" FOREIGN KEY ("idusuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "persona" ADD CONSTRAINT "fk_persona_pais" FOREIGN KEY ("idpais") REFERENCES "pais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "persona" ADD CONSTRAINT "persona_idusuario_fkey" FOREIGN KEY ("idusuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "provincia" ADD CONSTRAINT "fk_provincia_departamento" FOREIGN KEY ("iddepartamento") REFERENCES "departamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_idrol_fkey" FOREIGN KEY ("idrol") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detallepermisos" ADD CONSTRAINT "detallepermisos_idpermiso_fkey" FOREIGN KEY ("idpermiso") REFERENCES "permiso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detallepermisos" ADD CONSTRAINT "detallepermisos_idrol_fkey" FOREIGN KEY ("idrol") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
