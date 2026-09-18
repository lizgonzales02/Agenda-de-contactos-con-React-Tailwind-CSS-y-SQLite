import { useState, useEffect, useCallback } from 'react'
import { iniciarDB } from '../db/database.js'
import * as repo from '../db/contactosRepo.js'

export function useContactos() {
  const [listos, setListos] = useState(false)
  const [contactos, setContactos] = useState([])
  const [texto, setTexto] = useState('')
  const [grupo, setGrupo] = useState('Todos')
  const [orden, setOrden] = useState('nombre')
  const [error, setError] = useState('')
  const [grupos, setGrupos] = useState([])
  const [plantillas, setPlantillas] = useState([])

  const refrescar = useCallback(() => {
    setContactos(repo.listarContactos({ texto, grupo, orden }))
    setGrupos(repo.listarGrupos())
    setPlantillas(repo.listarPlantillas())
  }, [texto, grupo, orden])

  useEffect(() => {
    iniciarDB().then(() => setListos(true))
  }, [])

  useEffect(() => {
    if (listos) refrescar()
  }, [listos, refrescar])

  const ejecutar = (accion) => {
    try {
      accion()
      setError('')
      refrescar()
      return true
    } catch (e) {
      setError(
        String(e.message).includes('UNIQUE')
          ? 'Ese numero ya esta registrado en la agenda.'
          : 'No se pudo guardar. Revisa los datos.'
      )
      return false
    }
  }

  return {
    listos, contactos, texto, grupo, orden, error, grupos, plantillas,
    setTexto, setGrupo, setOrden,
    crear: (c) => ejecutar(() => repo.crearContacto(c)),
    actualizar: (id, c) => ejecutar(() => repo.actualizarContacto(id, c)),
    eliminar: (id) => ejecutar(() => repo.eliminarContacto(id)),
    favorito: (id) => ejecutar(() => repo.alternarFavorito(id)),
    crearGrupo: (n, color) => ejecutar(() => repo.crearGrupo(n, color)),
    registrarMensaje: (contactoId, texto) => ejecutar(() => repo.registrarMensaje(contactoId, texto))
  }
}
