import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { getAgendas, createAgenda, updateAgenda, deleteAgenda } from '../api/agendas'
import type { AgendaMedico } from '../api/agendas'
import { getMedicos } from '../api/medicos'
import type { Medico } from '../api/medicos'
import { getConsultorios } from '../api/consultorios'
import type { Consultorio } from '../api/consultorios'

const DAYS = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
  { value: 'Sábado', label: 'Sábado' },
]

const defaultForm = {
  idMedico: '',
  idConsultorio: '',
  diasDisponibles: [] as string[],
  horaInicio: '',
  horaFin: '',
}

const columns = [
  { key: 'idMedico', label: 'Médico' },
  { key: 'idConsultorio', label: 'Consultorio' },
  { key: 'diasDisponibles', label: 'Días', render: (item: AgendaMedico) => (item.diasDisponibles ?? []).join(', ') },
  { key: 'horaInicio', label: 'Hora Inicio' },
  { key: 'horaFin', label: 'Hora Fin' },
]

function toggleDay(days: string[], day: string): string[] {
  return days.includes(day) ? days.filter(d => d !== day) : [...days, day]
}

export default function AgendasMedico() {
  const [data, setData] = useState<AgendaMedico[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [consultorios, setConsultorios] = useState<Consultorio[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [res, resMed, resCon] = await Promise.allSettled([getAgendas(), getMedicos(), getConsultorios()])
      if (res.status === 'fulfilled') setData(res.value.data.AgendaMedico ?? [])
      if (resMed.status === 'fulfilled') setMedicos(resMed.value.data.medicos ?? [])
      if (resCon.status === 'fulfilled') setConsultorios(resCon.value.data.consultorios ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleEdit = (item: AgendaMedico) => {
    setEditingId(item.idAgenda ?? null)
    setForm({
      idMedico: item.idMedico,
      idConsultorio: item.idConsultorio,
      diasDisponibles: item.diasDisponibles ?? [],
      horaInicio: item.horaInicio,
      horaFin: item.horaFin,
    })
    setModalOpen(true)
  }

  const handleDelete = async (item: AgendaMedico) => {
    if (!confirm('¿Eliminar esta agenda?')) return
    try {
      await deleteAgenda(item.idAgenda!)
      fetchData()
    } catch {
      alert('Error al eliminar')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateAgenda(editingId, form as unknown as AgendaMedico)
      } else {
        await createAgenda(form as unknown as AgendaMedico)
      }
      setModalOpen(false)
      setEditingId(null)
      setForm(defaultForm)
      fetchData()
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      setError(axiosError.response?.data?.error || 'Error al guardar')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Agendas Médico</h1>
          <p className="text-white/50 text-sm mt-1">Gestión de agendas por médico</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="hero-btn px-5 py-2.5 rounded-xl text-sm font-medium">
          + Nueva Agenda
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay agendas registradas" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Agenda' : 'Nueva Agenda'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-500/10 text-red-400 rounded-xl">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Médico</label>
              <select value={form.idMedico} onChange={e => setForm({...form, idMedico: e.target.value})}
                className="hero-select w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required>
                <option value="">Seleccionar médico...</option>
                {medicos.map(m => (
                  <option key={m.idMedico} value={m.idMedico}>{m.nombres} {m.apellidos}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Consultorio</label>
              <select value={form.idConsultorio} onChange={e => setForm({...form, idConsultorio: e.target.value})}
                className="hero-select w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required>
                <option value="">Seleccionar consultorio...</option>
                {consultorios.map(c => (
                  <option key={c.idConsultorio} value={c.idConsultorio}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Hora Inicio</label>
              <input type="time" value={form.horaInicio} onChange={e => setForm({...form, horaInicio: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Hora Fin</label>
              <input type="time" value={form.horaFin} onChange={e => setForm({...form, horaFin: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Días Disponibles</label>
            <div className="flex flex-wrap gap-3">
              {DAYS.map(day => (
                <label key={day.value} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.diasDisponibles.includes(day.value)}
                    onChange={() => setForm({...form, diasDisponibles: toggleDay(form.diasDisponibles, day.value)})}
                    className="w-4 h-4 rounded border-white/10 text-clinic-400 focus:ring-clinic-500" />
                  {day.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
              className="hero-btn-secondary px-4 py-2 text-sm font-medium rounded-xl">Cancelar</button>
            <button type="submit"
              className="hero-btn px-5 py-2.5 rounded-xl text-sm font-medium">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
