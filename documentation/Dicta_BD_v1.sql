/* Dicta BD - alineado con prisma/schema.prisma (PostgreSQL) */
/****** Object:  UserDefinedFunction [dbo].[calculito_Mora]    Script Date: 30/09/2025 12:09:45 ******/
CREATE OR REPLACE FUNCTION calculito_Mora(V_fecha1 date, V_fecha2 date)
RETURNS numeric(9,2)
LANGUAGE plpgsql
AS $BODY$
DECLARE
  V_tasa numeric(9,2);
  V_mora numeric(9,2);
BEGIN
  SELECT TasaLegal/100 INTO V_tasa FROM PARAMETRO WHERE activo = 1;
  IF V_fecha1 > V_fecha2 THEN
    V_mora := 0;
  ELSE
    V_mora := DATE_PART('day', V_fecha2 - V_fecha1) * V_tasa;
  END IF;
  RETURN V_mora;
END;
$BODY$;

/****** Table: pais ******/
CREATE TABLE pais (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  nombre varchar(80) NOT NULL,
  estado smallint NOT NULL DEFAULT 1,
  fechacreacion timestamp(6) NOT NULL DEFAULT (now()),
  fechaactualizar timestamp(6) NULL,
  CONSTRAINT pais_pkey PRIMARY KEY (id)
);

/****** Table: rol (id sin autoincremento; valores explicitos) ******/
CREATE TABLE rol (
  id integer NOT NULL,
  nombrerol varchar(50) NULL,
  estado smallint NULL,
  descripcion varchar(200) NULL,
  tipo varchar(50) NULL,
  CONSTRAINT rol_pkey PRIMARY KEY (id)
);

/****** Table: accesos ******/
CREATE TABLE accesos (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  codigo varchar(50) NOT NULL,
  descripcion varchar(200) NULL,
  estado smallint NULL DEFAULT 1,
  CONSTRAINT accesos_pkey PRIMARY KEY (id),
  CONSTRAINT accesos_codigo_key UNIQUE (codigo)
);

/****** Table: permiso ******/
CREATE TABLE permiso (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  codigo varchar(50) NOT NULL,
  nombre varchar(100) NOT NULL,
  descripcion varchar(200) NULL,
  estado smallint NOT NULL DEFAULT 1,
  CONSTRAINT permiso_pkey PRIMARY KEY (id),
  CONSTRAINT permiso_codigo_key UNIQUE (codigo)
);

/****** Table: departamento ******/
CREATE TABLE departamento (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  idpais integer NOT NULL,
  nombre varchar(80) NOT NULL,
  estado smallint NOT NULL DEFAULT 1,
  fechacreacion timestamp(6) NOT NULL DEFAULT (now()),
  fechaactualizar timestamp(6) NULL,
  CONSTRAINT departamento_pkey PRIMARY KEY (id),
  CONSTRAINT fk_departamento_pais FOREIGN KEY (idpais) REFERENCES pais (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

/****** Table: provincia ******/
CREATE TABLE provincia (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  iddepartamento integer NOT NULL,
  nombre varchar(80) NOT NULL,
  estado smallint NOT NULL DEFAULT 1,
  fechacreacion timestamp(6) NOT NULL DEFAULT (now()),
  fechaactualizar timestamp(6) NULL,
  CONSTRAINT provincia_pkey PRIMARY KEY (id),
  CONSTRAINT fk_provincia_departamento FOREIGN KEY (iddepartamento) REFERENCES departamento (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

/****** Table: usuarios ******/
CREATE TABLE usuarios (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  username varchar(50) NOT NULL,
  email varchar(150) NOT NULL,
  auth_provider varchar(20) NOT NULL DEFAULT 'LOCAL',
  "password" varchar(255) NULL,
  fechadecreacion timestamp(6) NULL,
  estado smallint NULL,
  idrol integer NULL DEFAULT 3,
  "googleId" text NULL,
  reset_code varchar(6) NULL,
  reset_code_expires timestamp(6) NULL,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_email_key UNIQUE (email),
  CONSTRAINT usuarios_googleId_key UNIQUE ("googleId"),
  CONSTRAINT usuarios_idrol_fkey FOREIGN KEY (idrol) REFERENCES rol (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

/****** Table: perfil ******/
CREATE TABLE perfil (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  nombre varchar(50) NULL,
  "password" varchar(255) NULL,
  estado smallint NULL,
  imageurl text NULL,
  idusuario integer NULL,
  idrol integer NULL,
  CONSTRAINT perfil_pkey PRIMARY KEY (id),
  CONSTRAINT perfil_idrol_fkey FOREIGN KEY (idrol) REFERENCES rol (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT perfil_idusuario_fkey FOREIGN KEY (idusuario) REFERENCES usuarios (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

/****** Table: persona ******/
CREATE TABLE persona (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  nombre varchar(50) NULL,
  apellidopat varchar(50) NULL,
  apellidomat varchar(50) NULL,
  documento integer NULL,
  telefono integer NULL,
  idusuario integer NULL,
  codigopostal varchar(10) NULL,
  idpais integer NULL,
  CONSTRAINT persona_pkey PRIMARY KEY (id),
  CONSTRAINT fk_persona_pais FOREIGN KEY (idpais) REFERENCES pais (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT persona_idusuario_fkey FOREIGN KEY (idusuario) REFERENCES usuarios (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

/****** Table: orden ******/
CREATE TABLE orden (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  idusuario integer NOT NULL,
  montototal decimal(12, 2) NOT NULL,
  moneda varchar(10) NOT NULL,
  fechacreacion timestamp(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  estado varchar(20) NOT NULL,
  CONSTRAINT orden_pkey PRIMARY KEY (id),
  CONSTRAINT fk_orden_usuarios FOREIGN KEY (idusuario) REFERENCES usuarios (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

/****** Table: pagos ******/
CREATE TABLE pagos (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  idorden integer NOT NULL,
  metodopago varchar(50) NOT NULL,
  fechapago timestamp(6) NOT NULL,
  monto decimal(12, 2) NOT NULL,
  estado varchar(20) NOT NULL,
  nrcompra integer NULL,
  tipotarjeta varchar(20) NULL,
  nrtarjeta varchar(20) NULL,
  nombrepagante varchar(100) NULL,
  emailpagante varchar(150) NULL,
  CONSTRAINT pagos_pkey PRIMARY KEY (id),
  CONSTRAINT uq_pagos_idorden UNIQUE (idorden),
  CONSTRAINT fk_pagos_orden FOREIGN KEY (idorden) REFERENCES orden (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

/****** Table: documentospago ******/
CREATE TABLE documentospago (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  idpago integer NOT NULL,
  tipo varchar(50) NOT NULL,
  fechasubida timestamp(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  pdfurl varchar(500) NULL,
  xmlurl varchar(500) NULL,
  cdrurl varchar(500) NULL,
  estado smallint NOT NULL DEFAULT 1,
  fechacreacion timestamp(6) NOT NULL DEFAULT (now()),
  fechaupdate timestamp(6) NULL,
  CONSTRAINT documentospago_pkey PRIMARY KEY (id),
  CONSTRAINT uq_documentospago_idpago UNIQUE (idpago),
  CONSTRAINT fk_documentospago_pagos FOREIGN KEY (idpago) REFERENCES pagos (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

/****** Table: detalleorden ******/
CREATE TABLE detalleorden (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  idorden integer NOT NULL,
  idcurso char(24) NOT NULL,
  precio decimal(12, 2) NOT NULL,
  CONSTRAINT detalleorden_pkey PRIMARY KEY (id),
  CONSTRAINT fk_detalleorden_orden FOREIGN KEY (idorden) REFERENCES orden (id) ON UPDATE NO ACTION ON DELETE CASCADE
);

/****** Table: detalle_accesos ******/
CREATE TABLE detalle_accesos (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  idrol integer NOT NULL,
  idacceso integer NOT NULL,
  CONSTRAINT detalle_accesos_pkey PRIMARY KEY (id),
  CONSTRAINT detalle_accesos_idrol_idacceso_key UNIQUE (idrol, idacceso),
  CONSTRAINT detalle_accesos_idacceso_fkey FOREIGN KEY (idacceso) REFERENCES accesos (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT detalle_accesos_idrol_fkey FOREIGN KEY (idrol) REFERENCES rol (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

/****** Table: detallepermisos ******/
CREATE TABLE detallepermisos (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL,
  idrol integer NOT NULL,
  idpermiso integer NOT NULL,
  estado smallint NOT NULL DEFAULT 1,
  fechacreacion timestamp(6) NOT NULL DEFAULT (now()),
  CONSTRAINT detallepermisos_pkey PRIMARY KEY (id),
  CONSTRAINT detallepermisos_idrol_idpermiso_key UNIQUE (idrol, idpermiso),
  CONSTRAINT detallepermisos_idpermiso_fkey FOREIGN KEY (idpermiso) REFERENCES permiso (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT detallepermisos_idrol_fkey FOREIGN KEY (idrol) REFERENCES rol (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

/****** StoredProcedure: crearPerfil ******/
CREATE OR REPLACE PROCEDURE crearperfil(
  V_nombre varchar(50),
  V_password varchar(255),
  V_imageurl text,
  V_idrol integer,
  V_idusuario integer DEFAULT NULL
)
LANGUAGE plpgsql
AS $BODY$
BEGIN
  INSERT INTO perfil (nombre, "password", imageurl, idrol, idusuario)
  VALUES (V_nombre, V_password, V_imageurl, V_idrol, V_idusuario);
END;
$BODY$;

/****** StoredProcedure: EliminarPerfil ******/
CREATE OR REPLACE PROCEDURE eliminarperfil(V_idperfil integer)
LANGUAGE plpgsql
AS $BODY$
BEGIN
  DELETE FROM perfil WHERE id = V_idperfil;
END;
$BODY$;

/****** StoredProcedure: EliminarUsuario ******/
CREATE OR REPLACE PROCEDURE eliminarusuario(V_id integer)
LANGUAGE plpgsql
AS $BODY$
BEGIN
  DELETE FROM usuarios WHERE id = V_id;
END;
$BODY$;

/****** StoredProcedure: login_usuarios ******/
CREATE OR REPLACE PROCEDURE login_usuarios(
  V_email varchar(150),
  INOUT V_rc refcursor DEFAULT NULL
)
LANGUAGE plpgsql
AS $BODY$
BEGIN
  OPEN V_rc FOR
  SELECT id, username, email, auth_provider, "password", fechadecreacion, estado, idrol, "googleId"
  FROM usuarios
  WHERE email = V_email;
END;
$BODY$;

/****** StoredProcedure: registrarUsuario ******/
CREATE OR REPLACE PROCEDURE registrarusuario(
  V_username varchar(50),
  V_email varchar(150),
  V_password varchar(255),
  V_fechadecreacion timestamp(6),
  V_estado smallint,
  V_idrol integer,
  V_auth_provider varchar(20) DEFAULT 'LOCAL'
)
LANGUAGE plpgsql
AS $BODY$
BEGIN
  INSERT INTO usuarios (username, email, "password", fechadecreacion, estado, idrol, auth_provider)
  VALUES (V_username, V_email, V_password, V_fechadecreacion, V_estado, V_idrol, V_auth_provider);
END;
$BODY$;

/****** StoredProcedure: VisualizarPerfilesPorRol ******/
CREATE OR REPLACE PROCEDURE visualizarperfilesporrol(
  V_idrol integer,
  INOUT V_rc refcursor DEFAULT NULL
)
LANGUAGE plpgsql
AS $BODY$
BEGIN
  OPEN V_rc FOR
  SELECT * FROM perfil WHERE idrol = V_idrol;
END;
$BODY$;

/****** StoredProcedure: VisualizarUsuarios ******/
CREATE OR REPLACE PROCEDURE visualizarusuarios(INOUT V_rc refcursor DEFAULT NULL)
LANGUAGE plpgsql
AS $BODY$
BEGIN
  OPEN V_rc FOR
  SELECT id, username, email, auth_provider, "password", estado, idrol, "googleId"
  FROM usuarios
  ORDER BY id ASC;
END;
$BODY$;
