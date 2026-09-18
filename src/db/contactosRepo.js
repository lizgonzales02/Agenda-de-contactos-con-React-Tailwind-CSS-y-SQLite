import { obtenerDB, persistir } from './database.js'

const ORDENES = {
  'nombre':   'nombre COLLATE NOCASE ASC',
  'reciente': 'creado_en DESC',
  'grupo':    'grupo_id ASC, nombre COLLATE NOCASE ASC'
}

export function listarContactos({ texto = '', grupo = 'Todos', orden = 'nombre' } = {}) {
  const sqlOrden = ORDENES[orden] || ORDENES.nombre
  const stmt = obtenerDB().prepare(`
    SELECT c.*, g.nombre AS grupo_nombre, g.color AS grupo_color,
           (SELECT MAX(m.enviado_en) FROM mensajes m WHERE m.contacto_id = c.id) AS ultimo_mensaje
    FROM contactos c
    JOIN grupos g ON c.grupo_id = g.id
    WHERE (c.nombre LIKE $t OR c.apellido LIKE $t OR c.telefono LIKE $t)
      AND ($g = 'Todos' OR c.grupo_id = $g)
    ORDER BY c.favorito DESC, ${sqlOrden}
  `)
  stmt.bind({ $t: `%${texto}%`, $g: grupo === 'Todos' ? 'Todos' : grupo })

  const filas = []
  while (stmt.step()) filas.push(stmt.getAsObject())
  stmt.free()
  return filas
}

export function crearContacto(c) {
  obtenerDB().run(
    `INSERT INTO contactos (nombre, apellido, telefono, email, grupo_id, favorito, notas, cumple)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [c.nombre.trim(), c.apellido.trim(), c.telefono.trim(), c.email.trim(),
     c.grupo_id, c.favorito ? 1 : 0, c.notas.trim(), c.cumple || null]
  )
  persistir()
}

export function actualizarContacto(id, c) {
  obtenerDB().run(
    `UPDATE contactos
     SET nombre = ?, apellido = ?, telefono = ?, email = ?, grupo_id = ?, favorito = ?, notas = ?, cumple = ?
     WHERE id = ?`,
    [c.nombre, c.apellido, c.telefono, c.email, c.grupo_id, c.favorito ? 1 : 0, c.notas, c.cumple || null, id]
  )
  persistir()
}

export function eliminarContacto(id) {
  obtenerDB().run('DELETE FROM mensajes WHERE contacto_id = ?', [id])
  obtenerDB().run('DELETE FROM contactos WHERE id = ?', [id])
  persistir()
}

export function alternarFavorito(id) {
  obtenerDB().run(
    'UPDATE contactos SET favorito = CASE favorito WHEN 1 THEN 0 ELSE 1 END WHERE id = ?',
    [id]
  )
  persistir()
}

export function listarGrupos() {
  const res = obtenerDB().exec('SELECT id, nombre, color FROM grupos ORDER BY id')
  if (res.length === 0) return []
  return res[0].values.map(([id, nombre, color]) => ({ id, nombre, color }))
}

export function crearGrupo(nombre, color) {
  obtenerDB().run(
    'INSERT INTO grupos (nombre, color) VALUES (?, ?)',
    [nombre.trim(), color]
  )
  persistir()
}

export function registrarMensaje(contactoId, texto) {
  obtenerDB().run(
    'INSERT INTO mensajes (contacto_id, texto) VALUES (?, ?)',
    [contactoId, texto]
  )
  persistir()
}

export function listarPlantillas() {
  const res = obtenerDB().exec('SELECT id, nombre, texto FROM plantillas ORDER BY id')
  if (res.length === 0) return []
  return res[0].values.map(([id, nombre, texto]) => ({ id, nombre, texto }))
}
