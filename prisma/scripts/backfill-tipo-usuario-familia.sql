-- Marca como PREMIUM a las familias cuyo padre ya tiene al menos una orden COMPLETADA.
-- NO se ejecuta solo: correrlo a mano, una vez, DESPUÉS de aplicar la migración add_tipo_usuario_familia
-- y solo cuando Carlos o Johan lo confirmen.
--
-- Supone que auth y transaction están en la misma base (esquemas "auth" y "transaction", como en Neon hoy).
-- Si algún día están en bases separadas, hay que correr el equivalente desde back-transaction.
-- Es seguro repetirlo: solo sube a PREMIUM a quien tenga compra completada.

UPDATE "auth"."familia" f
SET "tipo_usuario" = 'PREMIUM'
WHERE f."tipo_usuario" <> 'PREMIUM'
  AND EXISTS (
    SELECT 1
    FROM "transaction"."orden" o
    WHERE o."idusuario" = f."idpadre"
      AND o."estado" = 'COMPLETADO'
  );
