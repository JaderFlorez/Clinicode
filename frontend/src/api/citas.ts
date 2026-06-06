import api from './client'

export interface CitaMedica {
  idCita?: string
  idPaciente: string
  idMedico: string
  idConsultorio: string
  fechaCita: string
  motivo: string
  estado: string
}

export interface CitaMedicaResponse {
  mensaje: string
  citas?: CitaMedica[]
  citasEncontradas?: number
  CitaMedica?: CitaMedica
  idCita?: string
}

export const getCitas = (limite?: number) =>
  api.get<CitaMedicaResponse>('/citas-medicas', { params: { limite } })

export const getCita = (id: string) =>
  api.get<CitaMedicaResponse>(`/citas-medicas/${id}`)

export const createCita = (data: Omit<CitaMedica, 'idCita'>) =>
  api.post<CitaMedicaResponse>('/citas-medicas', data)

export const updateCita = (id: string, data: Omit<CitaMedica, 'idCita'>) =>
  api.put<CitaMedicaResponse>(`/citas-medicas/${id}`, data)

export const deleteCita = (id: string) =>
  api.delete<CitaMedicaResponse>(`/citas-medicas/${id}`)
