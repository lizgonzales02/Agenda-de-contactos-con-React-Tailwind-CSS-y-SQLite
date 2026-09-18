import { useState } from 'react'
import { useContactos } from './hooks/useContactos.js'
import ContactoForm from './components/ContactoForm.jsx'
import ContactoCard from './components/ContactoCard.jsx'

export default function App() {
  const {
    listos, contactos, texto, categoria, error,
    setTexto, setCategoria, crear, actualizar, eliminar, favorito
  } = useContactos()

  const [editando, setEditando] = useState(null)

  const guardar = (c) => {
    const ok = editando
      ? actualizar(editando.id, c)
      : crear(c)
    if (ok) setEditando(null)
    return ok
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
        <h1 className="text-2xl font-bold text-slate-800">Agenda de Contactos</h1>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <ContactoForm editando={editando} onGuardar={guardar} onCancelar={() => setEditando(null)} />

        <div className="flex gap-3">
          <input
            type="search"
            placeholder="Buscar por nombre, apellido o telefono..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            {['Todas', 'Personal', 'Trabajo', 'SENATI', 'Familia'].map((c) =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>
        </div>

        <div className="space-y-3">
          {contactos.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-slate-500">
                {texto || categoria !== 'Todas'
                  ? 'No se encontraron contactos con esos filtros.'
                  : 'Tu agenda esta vacia. Agrega tu primer contacto arriba.'}
              </p>
            </div>
          ) : (
            contactos.map((c) => (
              <ContactoCard
                key={c.id}
                c={c}
                onEditar={setEditando}
                onEliminar={eliminar}
                onFavorito={favorito}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
