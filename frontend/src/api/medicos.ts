import api from './client'

export interface Medico {
  idMedico?: string
  nombres: string
  apellidos: string
  numeroLicencia: string
  idEspecialidad: string
  telefono?: string | null
  correo?: string | null
}

export interface MedicoResponse {
  mensaje: string
  medicos?: Medico[]
  medicosEncontrados?: number
  Medico?: Medico
  idMedico?: string
}

export const getMedicos = (limite?: number) =>
  api.get<MedicoResponse>('/medicos', { params: { limite } })

export const getMedico = (id: string) =>
  api.get<MedicoResponse>(`/medicos/${id}`)

export const createMedico = (data: Omit<Medico, 'idMedico'>) =>
  api.post<MedicoResponse>('/medicos', data)

export const updateMedico = (id: string, data: Omit<Medico, 'idMedico'>) =>
  api.put<MedicoResponse>(`/medicos/${id}`, data)

export const deleteMedico = (id: string) =>
  api.delete<MedicoResponse>(`/medicos/${id}`)
