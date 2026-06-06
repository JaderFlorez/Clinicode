import api from './client'

export interface Paciente {
  idPaciente?: string
  tipoDocumento: string
  numeroDocumento: string
  nombres: string
  apellidos: string
  fechaNacimiento: string
  telefono: string
  correo?: string | null
  direccion: string
}

export interface PacienteResponse {
  mensaje: string
  pacientes?: Paciente[]
  pacientesEncontrados?: number
  Paciente?: Paciente
  idPaciente?: string
}

export const getPacientes = (limite?: number) =>
  api.get<PacienteResponse>('/pacientes', { params: { limite } })

export const getPaciente = (id: string) =>
  api.get<PacienteResponse>(`/pacientes/${id}`)

export const createPaciente = (data: Omit<Paciente, 'idPaciente'>) =>
  api.post<PacienteResponse>('/pacientes', data)

export const updatePaciente = (id: string, data: Omit<Paciente, 'idPaciente'>) =>
  api.put<PacienteResponse>(`/pacientes/${id}`, data)

export const deletePaciente = (id: string) =>
  api.delete<PacienteResponse>(`/pacientes/${id}`)
