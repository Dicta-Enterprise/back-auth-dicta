-- CreateTable
CREATE TABLE "familia" (
    "id" SERIAL NOT NULL,
    "idpadre" INTEGER NOT NULL,
    "nombre" VARCHAR(100),
    "fechacreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "familia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "familia_idpadre_key" ON "familia"("idpadre");

-- AddForeignKey
ALTER TABLE "familia" ADD CONSTRAINT "fk_familia_padre" FOREIGN KEY ("idpadre") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
