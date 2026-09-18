import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { ESQUEMA } from './esquema.js'

const CLAVE = 'agenda_contactos_v1'

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
