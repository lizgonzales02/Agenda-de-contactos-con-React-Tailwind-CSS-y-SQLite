import { useState } from 'react'
import { useContactos } from './hooks/useContactos.js'
import { exportarDB, importarDB } from './db/database.js'
import { buscarDuplicados } from './utils/duplicados.js'
import ContactoForm from './components/ContactoForm.jsx'
import ContactoCard from './components/ContactoCard.jsx'
import DialogoConfirmar from './components/DialogoConfirmar.jsx'
import DialogoDuplicados from './components/DialogoDuplicados.jsx'
import Estadisticas from './components/Estadisticas.jsx'

export default function App() {
  const {
    listos, contactos, texto, grupo, orden, error, grupos,
    setTexto, setGrupo, setOrden,
    crear, actualizar, eliminar, favorito, crearGrupo, registrarMensaje
  } = useContactos()

  const [editando, setEditando] = useState(null)
  const [eliminando, setEliminando] = useState(null)
  const [mostrarStats, setMostrarStats] = useState(false)
  const [importando, setImportando] = useState(false)
  const [pendiente, setPendiente] = useState(null)
  const [duplicados, setDuplicados] = useState([])

  const guardarDirecto = (c) => {
    const ok = editando
      ? actualizar(editando.id, c)
      : crear(c)
    if (ok) setEditando(null)
    return ok
  }

  const guardar = (c) => {
    const encontrados = buscarDuplicados(c, contactos)
    if (encontrados.length > 0 && !editando) {
      setPendiente(c)
      setDuplicados(encontrados)
      return true
    }
    return guardarDirecto(c)
  }

  const fusionar = (duplicado) => {
    if (pendiente) {
      const fusionado = { ...duplicado, ...pendiente, id: duplicado.id }
      actualizar(duplicado.id, fusionado)
      setPendiente(null)
      setDuplicados([])
      setEditando(null)
    }
  }

  const ignorarDuplicado = () => {
    if (pendiente) {
      guardarDirecto(pendiente)
      setPendiente(null)
      setDuplicados([])
    }
  }

  const confirmarEliminar = () => {
    if (eliminando) {
      eliminar(eliminando.id)
      setEliminando(null)
    }
  }

  const handleWhatsApp = (contactoId, texto) => {
    registrarMensaje(contactoId, texto)
  }

  const handleImportar = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    setImportando(true)
    try {
      await importarDB(archivo)
      window.location.reload()
    } catch {
      alert('Error al importar el archivo.')
      setImportando(false)
    }
  }

  if (!listos) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <p className="text-slate-500">Cargando base de datos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Agenda de Contactos</h1>
          <div className="flex gap-2">
            <button onClick={() => setMostrarStats(!mostrarStats)}
              className="rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700">
              {mostrarStats ? 'Cerrar' : 'Estadisticas'}
            </button>
            <button onClick={exportarDB}
              className="rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700">
              Exportar
            </button>
            <label className="cursor-pointer rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700">
              {importando ? 'Importando...' : 'Importar'}
              <input type="file" accept=".db" onChange={handleImportar} className="hidden" disabled={importando} />
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {mostrarStats && <Estadisticas />}

        <ContactoForm
          editando={editando}
          onGuardar={guardar}
          onCancelar={() => setEditando(null)}
          grupos={grupos}
          onCrearGrupo={crearGrupo}
        />

        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Buscar por nombre, apellido o telefono..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={grupo} onChange={(e) => setGrupo(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="Todos">Todos los grupos</option>
            {(grupos || []).map((g) =>
              <option key={g.id} value={g.id}>{g.nombre}</option>
            )}
          </select>
          <select value={orden} onChange={(e) => setOrden(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="nombre">Nombre A-Z</option>
            <option value="reciente">Mas recientes</option>
            <option value="grupo">Por grupo</option>
          </select>
        </div>

        <div className="space-y-3">
          {contactos.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              {texto || grupo !== 'Todos' ? (
                <>
                  <p className="text-lg font-medium text-slate-700">Sin resultados</p>
                  <p className="mt-1 text-sm text-slate-500">
                    No se encontraron contactos con esos filtros.
                  </p>
                  <button onClick={() => { setTexto(''); setGrupo('Todos') }}
                    className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                    Limpiar busqueda
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-slate-700">Tu agenda esta vacia</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Agrega tu primer contacto usando el formulario de arriba.
                  </p>
                </>
              )}
            </div>
          ) : (
            contactos.map((c) => (
              <ContactoCard
                key={c.id}
                c={c}
                onEditar={setEditando}
                onEliminar={setEliminando}
                onFavorito={favorito}
                onWhatsApp={handleWhatsApp}
              />
            ))
          )}
        </div>
      </div>

      {eliminando && (
        <DialogoConfirmar
          mensaje={`¿Eliminar a ${eliminando.nombre} ${eliminando.apellido}? Esta accion no se puede deshacer.`}
          onAceptar={confirmarEliminar}
          onCancelar={() => setEliminando(null)}
        />
      )}

      {duplicados.length > 0 && (
        <DialogoDuplicados
          duplicados={duplicados}
          onFusionar={fusionar}
          onIgnorar={ignorarDuplicado}
        />
      )}
    </div>
  )
}
