import api from './client'

export interface DisponibilidadConsultorio {
  idDisponibilidad?: string
  idConsultorio: string
  diaSemana: string
  horaInicio: string
  horaFin: string
  disponible: boolean
}

export interface DisponibilidadResponse {
  mensaje: string
  disponibilidades?: DisponibilidadConsultorio[]
  disponibilidadesEncontradas?: number
  Disponibilidad?: DisponibilidadConsultorio
  idDisponibilidad?: string
}

export const getDisponibilidades = (limite?: number) =>
  api.get<DisponibilidadResponse>('/disponibilidades-consultorio', { params: { limite } })

export const getDisponibilidad = (id: string) =>
  api.get<DisponibilidadResponse>(`/disponibilidades-consultorio/${id}`)

export const createDisponibilidad = (data: Omit<DisponibilidadConsultorio, 'idDisponibilidad'>) =>
  api.post<DisponibilidadResponse>('/disponibilidades-consultorio', data)

export const updateDisponibilidad = (id: string, data: Omit<DisponibilidadConsultorio, 'idDisponibilidad'>) =>
  api.put<DisponibilidadResponse>(`/disponibilidades-consultorio/${id}`, data)

export const deleteDisponibilidad = (id: string) =>
  api.delete<DisponibilidadResponse>(`/disponibilidades-consultorio/${id}`)
