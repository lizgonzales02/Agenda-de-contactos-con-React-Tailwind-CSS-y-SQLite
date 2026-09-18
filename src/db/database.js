import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { ESQUEMA } from './esquema.js'

const CLAVE = 'agenda_contactos_v2'

let db = null

const aBase64 = (bytes) => btoa(String.fromCharCode(...bytes))
const aBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))

export async function iniciarDB() {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl })

  let guardada = null
  try {
    guardada = localStorage.getItem(CLAVE)
  } catch (e) {
    console.warn('Sin acceso a localStorage', e)
  }

  db = guardada
    ? new SQL.Database(aBytes(guardada))
    : new SQL.Database()

  db.run(ESQUEMA)
  persistir()

  window.mostrarTablas = () => {
    const tablas = db.exec("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('Tablas:', tablas[0]?.values)
    tablas[0]?.values.forEach(([t]) => {
      console.log(`--- ${t} ---`)
      console.table(db.exec(`SELECT * FROM ${t}`)[0]?.values.map(r => {
        const cols = db.exec(`PRAGMA table_info(${t})`)[0].values.map(c => c[1])
        const obj = {}
        cols.forEach((c, i) => obj[c] = r[i])
        return obj
      }))
    })
  }
  console.log('Escribe mostrarTablas() para ver las tablas')

  return db
}

export function obtenerDB() {
  if (!db) throw new Error('Llama a iniciarDB() antes de consultar.')
  return db
}

export function persistir() {
  try {
    localStorage.setItem(CLAVE, aBase64(db.export()))
  } catch (e) {
    console.warn('No se pudo guardar la base', e)
  }
}

export function exportarDB() {
  if (!db) throw new Error('Llama a iniciarDB() antes de exportar.')
  const bytes = db.export()
  const blob = new Blob([bytes], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'agenda.db'
  a.click()
  URL.revokeObjectURL(url)
}

export async function importarDB(archivo) {
  const buffer = await archivo.arrayBuffer()
  const SQL = await initSqlJs({ locateFile: () => wasmUrl })
  db = new SQL.Database(new Uint8Array(buffer))
  persistir()
}
