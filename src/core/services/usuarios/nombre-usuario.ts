import { HttpStatus } from '@nestjs/common';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

// Regla de negocio por confirmar con Carlos: ¿el registro exige nombre Y apellido? Mientras tanto basta el nombre
// (o el username de los clientes antiguos). Para exigir los dos, basta cambiar este valor a true.
export const EXIGIR_NOMBRE_Y_APELLIDO = false;

const MAX_NOMBRE = 80;
const MAX_USERNAME = 50; // el límite de la columna "username", que se mantiene por compatibilidad
// Letras (con tildes), espacios, apóstrofos, guiones y puntos: "María José", "O'Connor", "De la Cruz", "Jr."
const FORMATO_NOMBRE = /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*$/u;

export interface DatosNombre {
  nombre?: string | null;
  apellido?: string | null;
  // Clientes antiguos: mandan solo "username".
  username?: string | null;
}

export interface NombreResuelto {
  nombre: string;
  apellido: string | null;
  // Se sigue guardando: back-transaction, back-nest y los correos todavía lo leen.
  username: string;
}

const limpiar = (texto?: string | null): string => (texto ?? '').replace(/\s+/g, ' ').trim();

function invalido(mensaje: string, codigoError: string): never {
  throw new BussinesRuleException(mensaje, HttpStatus.BAD_REQUEST, { codigoError });
}

/**
 * Decide el nombre, el apellido y el username que se guardan al registrar un usuario.
 * - Con "nombre" (y "apellido"): el username se arma como "nombre apellido" (máximo 50 caracteres).
 * - Solo con "username" (clientes antiguos): ese texto pasa a ser el nombre y el apellido queda vacío.
 */
export function resolverNombre(datos: DatosNombre, exigirNombreYApellido = EXIGIR_NOMBRE_Y_APELLIDO): NombreResuelto {
  const nombre = limpiar(datos.nombre);
  const apellido = limpiar(datos.apellido);
  const username = limpiar(datos.username);

  if (!nombre && !username) {
    invalido('Debes indicar tu nombre.', 'NOMBRE_REQUERIDO');
  }

  if (!nombre) {
    // Cliente antiguo que solo manda "username"
    if (exigirNombreYApellido) {
      invalido('Debes indicar tu nombre y tu apellido.', 'NOMBRE_Y_APELLIDO_REQUERIDOS');
    }
    return { nombre: username.slice(0, MAX_NOMBRE), apellido: null, username: username.slice(0, MAX_USERNAME) };
  }

  if (exigirNombreYApellido && !apellido) {
    invalido('Debes indicar tu apellido.', 'APELLIDO_REQUERIDO');
  }
  if (nombre.length < 2 || nombre.length > MAX_NOMBRE || !FORMATO_NOMBRE.test(nombre)) {
    invalido('El nombre debe tener entre 2 y 80 letras y no puede llevar números ni símbolos.', 'NOMBRE_INVALIDO');
  }
  if (apellido && (apellido.length > MAX_NOMBRE || !FORMATO_NOMBRE.test(apellido))) {
    invalido('El apellido debe tener máximo 80 letras y no puede llevar números ni símbolos.', 'APELLIDO_INVALIDO');
  }

  return {
    nombre,
    apellido: apellido || null,
    username: `${nombre}${apellido ? ` ${apellido}` : ''}`.slice(0, MAX_USERNAME).trim(),
  };
}

/** Nombre completo para mostrar: "Ana Pérez"; si el usuario es antiguo (sin nombre guardado), su username. */
export function nombreCompleto(usuario: { nombre?: string | null; apellido?: string | null; username: string }): string {
  const completo = `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim();
  return completo || usuario.username;
}

/** Cómo se saluda en los correos: el primer nombre, o el username si el usuario es antiguo. */
export function nombreParaSaludo(usuario: { nombre?: string | null; username: string }): string {
  return usuario.nombre?.trim() || usuario.username;
}
