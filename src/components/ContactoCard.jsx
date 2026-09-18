import { enlaceWhatsApp, compartirContacto, descargarVCard } from '../utils/contacto.js'

function formatearFecha(fecha) {
  if (!fecha) return ''
  const [a, m, d] = fecha.split('-')
  return `${d}/${m}/${a}`
}

export default function ContactoCard({ c, onEditar, onEliminar, onFavorito }) {
  const saludo = `Hola ${c.nombre}, te escribo desde mi agenda de contactos.`
  const iniciales = (c.nombre[0] + (c.apellido[0] ?? '')).toUpperCase()

  return (
    <article className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-100 font-semibold text-blue-700">
          {iniciales}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{c.nombre} {c.apellido}</h3>
          <p className="text-sm text-slate-500">{c.telefono}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs">
              {c.categoria}
            </span>
            {c.cumple && (
              <span className="text-xs text-slate-400">
                🎂 {formatearFecha(c.cumple)}
              </span>
            )}
          </div>
        </div>

        <button onClick={() => onFavorito(c.id)} title="Favorito"
          className={c.favorito ? 'text-amber-500' : 'text-slate-300'}>
          ★
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a href={enlaceWhatsApp(c.telefono, saludo)} target="_blank" rel="noopener noreferrer"
          className="rounded-lg bg-whatsapp px-3 py-1.5 text-xs font-medium text-white">
          Escribir por WhatsApp
        </a>
        <button onClick={() => compartirContacto(c)}
          className="rounded-lg border px-3 py-1.5 text-xs">
          Compartir
        </button>
        <button onClick={() => descargarVCard(c)}
          className="rounded-lg border px-3 py-1.5 text-xs">
          Descargar .vcf
        </button>
        <button onClick={() => onEditar(c)}
          className="rounded-lg border px-3 py-1.5 text-xs">
          Editar
        </button>
        <button onClick={() => onEliminar(c.id)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600">
          Eliminar
        </button>
      </div>
    </article>
  )
}
