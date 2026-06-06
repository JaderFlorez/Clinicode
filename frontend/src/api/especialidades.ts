import api from './client'

export interface Especialidad {
  idEspecialidad?: string
  nombre: string
  descripcion?: string | null
}

export interface EspecialidadResponse {
  mensaje: string
  especialidades?: Especialidad[]
  especialidadesEncontradas?: number
  Especialidad?: Especialidad
  idEspecialidad?: string
}

export const getEspecialidades = (limite?: number) =>
  api.get<EspecialidadResponse>('/especialidades', { params: { limite } })

export const getEspecialidad = (id: string) =>
  api.get<EspecialidadResponse>(`/especialidades/${id}`)

export const createEspecialidad = (data: Omit<Especialidad, 'idEspecialidad'>) =>
  api.post<EspecialidadResponse>('/especialidades', data)

export const updateEspecialidad = (id: string, data: Omit<Especialidad, 'idEspecialidad'>) =>
  api.put<EspecialidadResponse>(`/especialidades/${id}`, data)

export const deleteEspecialidad = (id: string) =>
  api.delete<EspecialidadResponse>(`/especialidades/${id}`)
