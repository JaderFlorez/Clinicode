import api from './client'

export interface Consultorio {
  idConsultorio?: string
  nombre: string
  ubicacion: string
  disponible: boolean
}

export interface ConsultorioResponse {
  mensaje: string
  consultorios?: Consultorio[]
  consultoriosEncontrados?: number
  Consultorio?: Consultorio
  idConsultorio?: string
}

export const getConsultorios = (limite?: number) =>
  api.get<ConsultorioResponse>('/consultorios', { params: { limite } })

export const getConsultorio = (id: string) =>
  api.get<ConsultorioResponse>(`/consultorios/${id}`)

export const createConsultorio = (data: Omit<Consultorio, 'idConsultorio'>) =>
  api.post<ConsultorioResponse>('/consultorios', data)

export const updateConsultorio = (id: string, data: Omit<Consultorio, 'idConsultorio'>) =>
  api.put<ConsultorioResponse>(`/consultorios/${id}`, data)

export const deleteConsultorio = (id: string) =>
  api.delete<ConsultorioResponse>(`/consultorios/${id}`)
