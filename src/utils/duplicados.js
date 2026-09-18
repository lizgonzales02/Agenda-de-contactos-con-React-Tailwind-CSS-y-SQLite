function normalizar(texto) {
  return String(texto).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const d = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) d[i][0] = i
  for (let j = 0; j <= n; j++) d[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + costo
      )
    }
  }
  return d[m][n]
}

export function similitud(a, b) {
  const na = normalizar(a)
  const nb = normalizar(b)
  if (na === nb) return 1
  const dist = levenshtein(na, nb)
  const maxLen = Math.max(na.length, nb.length)
  return maxLen === 0 ? 1 : 1 - dist / maxLen
}

export function buscarDuplicados(contacto, existentes, umbral = 0.85) {
  return existentes.filter((c) => {
    if (contacto.id && c.id === contacto.id) return false

    const simNombre = similitud(
      `${contacto.nombre} ${contacto.apellido}`,
      `${c.nombre} ${c.apellido}`
    )
    if (simNombre >= umbral) return true

    const simTel = similitud(contacto.telefono, c.telefono)
    if (simTel >= 0.9) return true

    return false
  }).map((c) => ({
    ...c,
    razon: similitud(`${contacto.nombre} ${contacto.apellido}`, `${c.nombre} ${c.apellido}`) >= 0.85
      ? 'Nombre similar'
      : 'Telefono similar'
  }))
}
