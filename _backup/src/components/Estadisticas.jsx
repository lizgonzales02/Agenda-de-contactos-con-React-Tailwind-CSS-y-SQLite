import { useState, useEffect } from 'react'
import { obtenerDB } from '../db/database.js'

export default function Estadisticas() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const db = obtenerDB()

    const total = db.exec('SELECT COUNT(*) AS total FROM contactos')
    const favoritos = db.exec('SELECT COUNT(*) AS total FROM contactos WHERE favorito = 1')
    const porGrupo = db.exec(`
      SELECT g.nombre, g.color, COUNT(c.id) AS total
      FROM grupos g
      LEFT JOIN contactos c ON c.grupo_id = g.id
      GROUP BY g.id
      ORDER BY total DESC
    `)
    const masAntiguo = db.exec(`
      SELECT nombre, apellido, telefono, creado_en
      FROM contactos
      ORDER BY creado_en ASC
      LIMIT 1
    `)

    setStats({
      total: total[0]?.values[0][0] || 0,
      favoritos: favoritos[0]?.values[0][0] || 0,
      porGrupo: porGrupo[0]?.values || [],
      masAntiguo: masAntiguo[0]?.values[0] || null
    })
  }, [])

  if (!stats) return null

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold">Estadisticas</h2>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-xs text-slate-500">Contactos totales</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-2xl font-bold text-amber-500">{stats.favoritos}</p>
          <p className="text-xs text-slate-500">Favoritos</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-1 text-xs font-medium text-slate-600">Por grupo:</p>
        <div className="space-y-1">
          {stats.porGrupo.map(([nombre, color, total], i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="flex-1">{nombre}</span>
              <span className="font-medium">{total}</span>
            </div>
          ))}
        </div>
      </div>

      {stats.masAntiguo && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Contacto mas antiguo:</p>
          <p className="text-sm font-medium">
            {stats.masAntiguo[0]} {stats.masAntiguo[1]} - {stats.masAntiguo[2]}
          </p>
          <p className="text-xs text-slate-400">{stats.masAntiguo[3]}</p>
        </div>
      )}
    </div>
  )
}
