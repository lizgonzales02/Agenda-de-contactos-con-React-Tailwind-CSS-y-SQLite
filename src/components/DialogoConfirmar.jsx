export default function DialogoConfirmar({ mensaje, onAceptar, onCancelar }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <p className="text-sm text-slate-700">{mensaje}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancelar}
            className="rounded-lg border px-4 py-2 text-sm">
            Cancelar
          </button>
          <button onClick={onAceptar}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
