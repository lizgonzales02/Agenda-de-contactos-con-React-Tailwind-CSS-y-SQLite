export const ESQUEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS grupos (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT    NOT NULL UNIQUE,
  color  TEXT    NOT NULL DEFAULT '#64748b'
);

INSERT OR IGNORE INTO grupos (nombre, color) VALUES
  ('Personal', '#3b82f6'),
  ('Trabajo',  '#f59e0b'),
  ('SENATI',   '#10b981'),
  ('Familia',  '#ef4444');

CREATE TABLE IF NOT EXISTS contactos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre    TEXT    NOT NULL,
  apellido  TEXT    NOT NULL DEFAULT '',
  telefono  TEXT    NOT NULL UNIQUE,
  email     TEXT,
  grupo_id  INTEGER NOT NULL DEFAULT 1
              REFERENCES grupos(id),
  favorito  INTEGER NOT NULL DEFAULT 0 CHECK (favorito IN (0,1)),
  notas     TEXT,
  cumple    TEXT,
  creado_en TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_contactos_nombre
  ON contactos(nombre);

CREATE TABLE IF NOT EXISTS mensajes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  contacto_id INTEGER NOT NULL REFERENCES contactos(id),
  texto       TEXT    NOT NULL DEFAULT '',
  enviado_en  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_mensajes_contacto
  ON mensajes(contacto_id);

CREATE TABLE IF NOT EXISTS plantillas (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre  TEXT NOT NULL,
  texto   TEXT NOT NULL
);

INSERT OR IGNORE INTO plantillas (nombre, texto) VALUES
  ('Saludo',            'Hola {nombre}, te escribo desde mi agenda de contactos.'),
  ('Recordatorio',      'Hola {nombre}, te recuerdo nuestra reunión pendiente.'),
  ('Cobranza',          'Hola {nombre}, te escribo para recordarte el pago pendiente.');
`;
