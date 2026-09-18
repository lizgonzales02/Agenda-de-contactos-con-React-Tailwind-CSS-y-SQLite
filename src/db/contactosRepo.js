import { obtenerDB, persistir } from './database.js'

export function listarContactos({ texto = '', categoria = 'Todas' } = {}) {
  const stmt = obtenerDB().prepare(`
    SELECT * FROM contactos
    WHERE (nombre LIKE $t OR apellido LIKE $t OR telefono LIKE $t)
      AND ($c = 'Todas' OR categoria = $c)
    ORDER BY favorito DESC, nombre COLLATE NOCASE ASC
  `)
  stmt.bind({ $t: `%${texto}%`, $c: categoria })

  const filas = []
  while (stmt.step()) filas.push(stmt.getAsObject())
  stmt.free()
  return filas
}

export function crearContacto(c) {
  obtenerDB().run(
    `INSERT INTO contactos (nombre, apellido, telefono, email, categoria, favorito, notas, cumple)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [c.nombre.trim(), c.apellido.trim(), c.telefono.trim(), c.email.trim(),
     c.categoria, c.favorito ? 1 : 0, c.notas.trim(), c.cumple || null]
  )
  persistir()
}

export function actualizarContacto(id, c) {
  obtenerDB().run(
    `UPDATE contactos
     SET nombre = ?, apellido = ?, telefono = ?, email = ?, categoria = ?, favorito = ?, notas = ?, cumple = ?
     WHERE id = ?`,
    [c.nombre, c.apellido, c.telefono, c.email, c.categoria, c.favorito ? 1 : 0, c.notas, c.cumple || null, id]
  )
  persistir()
}

export function eliminarContacto(id) {
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

export function resumenPorCategoria() {
  const res = obtenerDB().exec(
    'SELECT categoria, COUNT(*) AS total FROM contactos GROUP BY categoria'
  )
  if (res.length === 0) return []
  return res[0].values.map(([categoria, total]) => ({ categoria, total }))
}
