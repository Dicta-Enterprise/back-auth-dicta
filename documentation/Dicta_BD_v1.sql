CREATE TABLE accesos (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    descripcion character varying(200),
    estado smallint DEFAULT 1
);

CREATE SEQUENCE accesos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE accesos_id_seq OWNED BY accesos.id;

CREATE TABLE carrito (
    id integer NOT NULL,
    idusuario integer NOT NULL,
    createdat timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedat timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "carritoCurso" (
    id integer NOT NULL,
    "carritoId" integer NOT NULL,
    idcurso character(24) NOT NULL,
    nombrecurso character varying(150)
);

CREATE SEQUENCE "carritoCurso_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "carritoCurso_id_seq" OWNED BY "carritoCurso".id;

CREATE SEQUENCE carrito_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE carrito_id_seq OWNED BY carrito.id;

CREATE TABLE departamento (
    id integer NOT NULL,
    idpais integer NOT NULL,
    nombre character varying(80) NOT NULL,
    estado smallint DEFAULT 1 NOT NULL,
    fechacreacion timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fechaactualizar timestamp(6) without time zone
);

CREATE SEQUENCE departamento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE departamento_id_seq OWNED BY departamento.id;

CREATE TABLE detalle_accesos (
    id integer NOT NULL,
    idrol integer NOT NULL,
    idacceso integer NOT NULL
);

CREATE SEQUENCE detalle_accesos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE detalle_accesos_id_seq OWNED BY detalle_accesos.id;

CREATE TABLE detalleorden (
    id integer NOT NULL,
    idorden integer NOT NULL,
    idcurso character(24) NOT NULL,
    precio numeric(12,2) NOT NULL,
    nombrecurso character varying(150)
);

CREATE SEQUENCE detalleorden_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE detalleorden_id_seq OWNED BY detalleorden.id;

CREATE TABLE detallepermisos (
    id integer NOT NULL,
    idrol integer NOT NULL,
    idpermiso integer NOT NULL,
    estado smallint DEFAULT 1 NOT NULL,
    fechacreacion timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE detallepermisos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE detallepermisos_id_seq OWNED BY detallepermisos.id;

CREATE TABLE "eventoCorreo" (
    id integer NOT NULL,
    messageid character varying(200),
    evento character varying(50) NOT NULL,
    email character varying(150),
    createdat timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE "eventoCorreo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "eventoCorreo_id_seq" OWNED BY "eventoCorreo".id;

CREATE TABLE orden (
    id integer NOT NULL,
    idusuario integer NOT NULL,
    fechacreacion timestamp(6) without time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    estado character varying(20) NOT NULL,
    acepto_terminos boolean DEFAULT false NOT NULL
);

CREATE SEQUENCE orden_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE orden_id_seq OWNED BY orden.id;

CREATE TABLE pagos (
    id integer NOT NULL,
    idorden integer NOT NULL,
    metodopago character varying(10) NOT NULL,
    fechapago timestamp(6) without time zone NOT NULL,
    monto numeric(12,2) NOT NULL,
    estado text DEFAULT 'PENDIENTE'::text NOT NULL,
    nrcompra integer NOT NULL,
    tipotarjeta character varying(20),
    nombrepagante character varying(100),
    emailpagante character varying(150),
    transactionid character varying(150),
    moneda character varying(10),
    processing_mode text DEFAULT 'automatic'::text,
    cufe character varying(200),
    numero_factura character varying(50),
    factura_url text
);

CREATE SEQUENCE pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE pagos_id_seq OWNED BY pagos.id;

CREATE SEQUENCE pagos_nrcompra_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE pagos_nrcompra_seq OWNED BY pagos.nrcompra;

CREATE TABLE pais (
    id integer NOT NULL,
    nombre character varying(80) NOT NULL,
    estado smallint DEFAULT 1 NOT NULL,
    fechacreacion timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fechaactualizar timestamp(6) without time zone
);

CREATE SEQUENCE pais_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE pais_id_seq OWNED BY pais.id;

CREATE TABLE perfil (
    id integer NOT NULL,
    nombre character varying(50),
    password character varying(255),
    estado smallint,
    imageurl text,
    idusuario integer,
    idrol integer
);

CREATE SEQUENCE perfil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE perfil_id_seq OWNED BY perfil.id;

CREATE TABLE permiso (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(200),
    estado smallint DEFAULT 1 NOT NULL
);

CREATE SEQUENCE permiso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE permiso_id_seq OWNED BY permiso.id;

CREATE TABLE persona (
    id integer NOT NULL,
    nombre character varying(50),
    apellidopat character varying(50),
    apellidomat character varying(50),
    documento integer,
    telefono integer,
    idusuario integer,
    codigopostal character varying(10),
    idpais integer
);

CREATE SEQUENCE persona_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE persona_id_seq OWNED BY persona.id;

CREATE TABLE provincia (
    id integer NOT NULL,
    iddepartamento integer NOT NULL,
    nombre character varying(80) NOT NULL,
    estado smallint DEFAULT 1 NOT NULL,
    fechacreacion timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fechaactualizar timestamp(6) without time zone
);

CREATE SEQUENCE provincia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE provincia_id_seq OWNED BY provincia.id;

CREATE TABLE rol (
    id integer NOT NULL,
    nombrerol character varying(50),
    estado smallint,
    descripcion character varying(200),
    tipo character varying(50)
);

CREATE TABLE usuarios (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    auth_provider character varying(20) DEFAULT 'LOCAL'::character varying NOT NULL,
    password character varying(255),
    fechadecreacion timestamp(3) without time zone,
    estado smallint,
    idrol integer DEFAULT 4,
    "googleId" text,
    terminos_condiciones boolean DEFAULT false NOT NULL,
    reset_code character varying(6),
    reset_code_expires timestamp(6) without time zone,
    reset_attempts integer DEFAULT 0 NOT NULL,
    verify_code character varying(6),
    verify_code_expires timestamp(6) without time zone,
    verify_attempts integer DEFAULT 0 NOT NULL
);

CREATE SEQUENCE usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE usuarios_id_seq OWNED BY usuarios.id;

ALTER TABLE ONLY accesos ALTER COLUMN id SET DEFAULT nextval('accesos_id_seq'::regclass);

ALTER TABLE ONLY carrito ALTER COLUMN id SET DEFAULT nextval('carrito_id_seq'::regclass);

ALTER TABLE ONLY "carritoCurso" ALTER COLUMN id SET DEFAULT nextval('"carritoCurso_id_seq"'::regclass);

ALTER TABLE ONLY departamento ALTER COLUMN id SET DEFAULT nextval('departamento_id_seq'::regclass);

ALTER TABLE ONLY detalle_accesos ALTER COLUMN id SET DEFAULT nextval('detalle_accesos_id_seq'::regclass);

ALTER TABLE ONLY detalleorden ALTER COLUMN id SET DEFAULT nextval('detalleorden_id_seq'::regclass);

ALTER TABLE ONLY detallepermisos ALTER COLUMN id SET DEFAULT nextval('detallepermisos_id_seq'::regclass);

ALTER TABLE ONLY "eventoCorreo" ALTER COLUMN id SET DEFAULT nextval('"eventoCorreo_id_seq"'::regclass);

ALTER TABLE ONLY orden ALTER COLUMN id SET DEFAULT nextval('orden_id_seq'::regclass);

ALTER TABLE ONLY pagos ALTER COLUMN id SET DEFAULT nextval('pagos_id_seq'::regclass);

ALTER TABLE ONLY pagos ALTER COLUMN nrcompra SET DEFAULT nextval('pagos_nrcompra_seq'::regclass);

ALTER TABLE ONLY pais ALTER COLUMN id SET DEFAULT nextval('pais_id_seq'::regclass);

ALTER TABLE ONLY perfil ALTER COLUMN id SET DEFAULT nextval('perfil_id_seq'::regclass);

ALTER TABLE ONLY permiso ALTER COLUMN id SET DEFAULT nextval('permiso_id_seq'::regclass);

ALTER TABLE ONLY persona ALTER COLUMN id SET DEFAULT nextval('persona_id_seq'::regclass);

ALTER TABLE ONLY provincia ALTER COLUMN id SET DEFAULT nextval('provincia_id_seq'::regclass);

ALTER TABLE ONLY usuarios ALTER COLUMN id SET DEFAULT nextval('usuarios_id_seq'::regclass);

ALTER TABLE ONLY accesos
    ADD CONSTRAINT accesos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "carritoCurso"
    ADD CONSTRAINT "carritoCurso_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY carrito
    ADD CONSTRAINT carrito_pkey PRIMARY KEY (id);

ALTER TABLE ONLY departamento
    ADD CONSTRAINT departamento_pkey PRIMARY KEY (id);

ALTER TABLE ONLY detalle_accesos
    ADD CONSTRAINT detalle_accesos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY detalleorden
    ADD CONSTRAINT detalleorden_pkey PRIMARY KEY (id);

ALTER TABLE ONLY detallepermisos
    ADD CONSTRAINT detallepermisos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "eventoCorreo"
    ADD CONSTRAINT "eventoCorreo_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY orden
    ADD CONSTRAINT orden_pkey PRIMARY KEY (id);

ALTER TABLE ONLY pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY pais
    ADD CONSTRAINT pais_pkey PRIMARY KEY (id);

ALTER TABLE ONLY perfil
    ADD CONSTRAINT perfil_pkey PRIMARY KEY (id);

ALTER TABLE ONLY permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (id);

ALTER TABLE ONLY persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id);

ALTER TABLE ONLY provincia
    ADD CONSTRAINT provincia_pkey PRIMARY KEY (id);

ALTER TABLE ONLY rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id);

ALTER TABLE ONLY usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX accesos_codigo_key ON accesos USING btree (codigo);

CREATE UNIQUE INDEX detalle_accesos_idrol_idacceso_key ON detalle_accesos USING btree (idrol, idacceso);

CREATE UNIQUE INDEX detallepermisos_idrol_idpermiso_key ON detallepermisos USING btree (idrol, idpermiso);

CREATE UNIQUE INDEX permiso_codigo_key ON permiso USING btree (codigo);

CREATE UNIQUE INDEX uq_pagos_idorden ON pagos USING btree (idorden);

CREATE UNIQUE INDEX usuarios_email_key ON usuarios USING btree (email);

CREATE UNIQUE INDEX "usuarios_googleId_key" ON usuarios USING btree ("googleId");

ALTER TABLE ONLY "carritoCurso"
    ADD CONSTRAINT "carritoCurso_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES carrito(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY detalle_accesos
    ADD CONSTRAINT detalle_accesos_idacceso_fkey FOREIGN KEY (idacceso) REFERENCES accesos(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY detalle_accesos
    ADD CONSTRAINT detalle_accesos_idrol_fkey FOREIGN KEY (idrol) REFERENCES rol(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY detalleorden
    ADD CONSTRAINT detalleorden_idorden_fkey FOREIGN KEY (idorden) REFERENCES orden(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY detallepermisos
    ADD CONSTRAINT detallepermisos_idpermiso_fkey FOREIGN KEY (idpermiso) REFERENCES permiso(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY detallepermisos
    ADD CONSTRAINT detallepermisos_idrol_fkey FOREIGN KEY (idrol) REFERENCES rol(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY carrito
    ADD CONSTRAINT fk_carrito_usuario FOREIGN KEY (idusuario) REFERENCES usuarios(id);

ALTER TABLE ONLY departamento
    ADD CONSTRAINT fk_departamento_pais FOREIGN KEY (idpais) REFERENCES pais(id);

ALTER TABLE ONLY persona
    ADD CONSTRAINT fk_persona_pais FOREIGN KEY (idpais) REFERENCES pais(id);

ALTER TABLE ONLY provincia
    ADD CONSTRAINT fk_provincia_departamento FOREIGN KEY (iddepartamento) REFERENCES departamento(id);

ALTER TABLE ONLY orden
    ADD CONSTRAINT orden_idusuario_fkey FOREIGN KEY (idusuario) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY pagos
    ADD CONSTRAINT pagos_idorden_fkey FOREIGN KEY (idorden) REFERENCES orden(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY perfil
    ADD CONSTRAINT perfil_idrol_fkey FOREIGN KEY (idrol) REFERENCES rol(id);

ALTER TABLE ONLY perfil
    ADD CONSTRAINT perfil_idusuario_fkey FOREIGN KEY (idusuario) REFERENCES usuarios(id);

ALTER TABLE ONLY persona
    ADD CONSTRAINT persona_idusuario_fkey FOREIGN KEY (idusuario) REFERENCES usuarios(id);

ALTER TABLE ONLY usuarios
    ADD CONSTRAINT usuarios_idrol_fkey FOREIGN KEY (idrol) REFERENCES rol(id);