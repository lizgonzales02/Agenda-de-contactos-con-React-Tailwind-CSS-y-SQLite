import { useState, useEffect } from 'react'

const VACIO = {
  nombre: '', apellido: '', telefono: '', email: '',
  grupo_id: 1, favorito: false, notas: '', cumple: ''
}

export default function ContactoForm({ editando, onGuardar, onCancelar, grupos, onCrearGrupo }) {
  const [form, setForm] = useState(VACIO)
  const [fallos, setFallos] = useState({})
  const [mostrarGrupo, setMostrarGrupo] = useState(false)
  const [nuevoGrupo, setNuevoGrupo] = useState('')
  const [colorGrupo, setColorGrupo] = useState('#64748b')

  useEffect(() => {
    setForm(editando
      ? { ...editando, favorito: !!editando.favorito, cumple: editando.cumple || '' }
      : VACIO)
    setFallos({})
  }, [editando])

  const cambiar = (campo) => (e) =>
    setForm({
      ...form,
      [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    })

  const validar = () => {
    const f = {}
    if (!form.nombre.trim()) f.nombre = 'Escribe el nombre'
    if (!/^[0-9+\s]{6,15}$/.test(form.telefono)) f.telefono = 'Telefono no valido'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) f.email = 'Correo no valido'
    setFallos(f)
    return Object.keys(f).length === 0
  }

  const enviar = () => {
    if (!validar()) return
    if (onGuardar(form)) setForm(VACIO)
  }

  const agregarGrupo = () => {
    if (!nuevoGrupo.trim()) return
    onCrearGrupo(nuevoGrupo, colorGrupo)
    setNuevoGrupo('')
    setMostrarGrupo(false)
  }

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold">
        {editando ? 'Editar contacto' : 'Nuevo contacto'}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <input className={input} placeholder="Nombre" value={form.nombre} onChange={cambiar('nombre')} />
          {fallos.nombre && <p className="mt-1 text-xs text-red-600">{fallos.nombre}</p>}
        </div>

        <input className={input} placeholder="Apellido" value={form.apellido} onChange={cambiar('apellido')} />

        <div>
          <input className={input} placeholder="Telefono: 965123456" value={form.telefono} onChange={cambiar('telefono')} />
          {fallos.telefono && <p className="mt-1 text-xs text-red-600">{fallos.telefono}</p>}
        </div>

        <input className={input} placeholder="Correo" value={form.email} onChange={cambiar('email')} />

        <div className="flex gap-2">
          <select className={input + ' flex-1'} value={form.grupo_id} onChange={cambiar('grupo_id')}>
            {(grupos || []).map((g) =>
              <option key={g.id} value={g.id}>{g.nombre}</option>
            )}
          </select>
          <button type="button" onClick={() => setMostrarGrupo(!mostrarGrupo)}
            className="shrink-0 rounded-lg border px-2 text-sm" title="Crear grupo">
            +
          </button>
        </div>

        {mostrarGrupo && (
          <div className="flex gap-2">
            <input className={input + ' flex-1'} placeholder="Nuevo grupo" value={nuevoGrupo}
              onChange={(e) => setNuevoGrupo(e.target.value)} />
            <input type="color" value={colorGrupo} onChange={(e) => setColorGrupo(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded border" />
            <button onClick={agregarGrupo}
              className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs text-white">OK</button>
          </div>
        )}

        <input type="date" className={input} value={form.cumple} onChange={cambiar('cumple')} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.favorito} onChange={cambiar('favorito')} />
          Marcar como favorito
        </label>
      </div>

      <div className="flex gap-2">
        <button onClick={enviar}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          {editando ? 'Guardar cambios' : 'Agregar contacto'}
        </button>
        {editando && (
          <button onClick={onCancelar}
            className="rounded-lg border px-4 py-2 text-sm">
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}
