import api from './client'

export interface AgendaMedico {
  idAgenda?: string
  idMedico: string
  idConsultorio: string
  diasDisponibles: string[]
  horaInicio: string
  horaFin: string
}

export interface AgendaMedicoResponse {
  mensaje: string
  AgendaMedico?: AgendaMedico[]
  TotalAgendamientos?: number
  idAgenda?: string
}

export const getAgendas = (limite?: number) =>
  api.get<AgendaMedicoResponse>('/agendas-medico', { params: { limite } })

export const getAgenda = (id: string) =>
  api.get<AgendaMedicoResponse>(`/agendas-medico/${id}`)

export const createAgenda = (data: Omit<AgendaMedico, 'idAgenda'>) =>
  api.post<AgendaMedicoResponse>('/agendas-medico', data)

export const updateAgenda = (id: string, data: Omit<AgendaMedico, 'idAgenda'>) =>
  api.put<AgendaMedicoResponse>(`/agendas-medico/${id}`, data)

export const deleteAgenda = (id: string) =>
  api.delete<AgendaMedicoResponse>(`/agendas-medico/${id}`)
