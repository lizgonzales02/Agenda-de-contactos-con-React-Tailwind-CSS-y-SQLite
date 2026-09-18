export default function DialogoDuplicados({ duplicados, onFusionar, onIgnorar }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-base font-semibold text-slate-800">
          Contacto similar encontrado
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Se detecto un contacto parecido en tu agenda:
        </p>

        <div className="mt-3 space-y-2">
          {duplicados.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <div>
                <p className="text-sm font-medium">{d.nombre} {d.apellido}</p>
                <p className="text-xs text-slate-500">{d.telefono} - {d.razon}</p>
              </div>
              <button onClick={() => onFusionar(d)}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700">
                Fusionar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onIgnorar}
            className="rounded-lg border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Guardar de todos modos
          </button>
        </div>
      </div>
    </div>
  )
}
