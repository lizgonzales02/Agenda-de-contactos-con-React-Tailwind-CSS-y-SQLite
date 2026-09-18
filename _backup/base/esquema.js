export const ESQUEMA = `
CREATE TABLE IF NOT EXISTS contactos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre    TEXT    NOT NULL,
  apellido  TEXT    NOT NULL DEFAULT '',
  telefono  TEXT    NOT NULL UNIQUE,
  email     TEXT,
  categoria TEXT    NOT NULL DEFAULT 'Personal'
              CHECK (categoria IN ('Personal','Trabajo','SENATI','Familia')),
  favorito  INTEGER NOT NULL DEFAULT 0 CHECK (favorito IN (0,1)),
  notas     TEXT,
  creado_en TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_contactos_nombre
  ON contactos(nombre);
`;
