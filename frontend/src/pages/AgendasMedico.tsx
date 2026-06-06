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

function toggleDay(days: string[], day: string): string[] {
  return days.includes(day) ? days.filter(d => d !== day) : [...days, day]
}

export default function AgendasMedico() {
  const [data, setData] = useState<AgendaMedico[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [consultorios, setConsultorios] = useState<Consultorio[]>([])

  const medicoName = (id: string) => {
    const m = medicos.find(m => m.idMedico === id)
    return m ? `${m.nombres} ${m.apellidos}` : id
  }

  const consultorioNombre = (id: string) => {
    const c = consultorios.find(c => c.idConsultorio === id)
    return c ? c.nombre : id
  }

  const columns = [
    { key: 'idMedico', label: 'Médico', render: (item: AgendaMedico) => medicoName(item.idMedico) },
    { key: 'idConsultorio', label: 'Consultorio', render: (item: AgendaMedico) => consultorioNombre(item.idConsultorio) },
    { key: 'diasDisponibles', label: 'Días', render: (item: AgendaMedico) => (item.diasDisponibles ?? []).join(', ') },
    { key: 'horaInicio', label: 'Hora Inicio' },
    { key: 'horaFin', label: 'Hora Fin' },
  ]
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
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Agendas Médico</h1>
          <p className="text-[#64748b] text-sm mt-1">Gestión de agendas por médico</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-clinic-500 text-white text-sm font-medium
            hover:bg-clinic-600 active:bg-clinic-700 transition-all duration-200 shadow-sm shadow-clinic-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Agenda
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay agendas registradas" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Agenda' : 'Nueva Agenda'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Médico</label>
              <select value={form.idMedico} onChange={e => setForm({...form, idMedico: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all" required>
                <option value="">Seleccionar médico...</option>
                {medicos.map(m => (
                  <option key={m.idMedico} value={m.idMedico}>{m.nombres} {m.apellidos}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Consultorio</label>
              <select value={form.idConsultorio} onChange={e => setForm({...form, idConsultorio: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all" required>
                <option value="">Seleccionar consultorio...</option>
                {consultorios.map(c => (
                  <option key={c.idConsultorio} value={c.idConsultorio}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Hora Inicio</label>
              <input type="time" value={form.horaInicio} onChange={e => setForm({...form, horaInicio: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Hora Fin</label>
              <input type="time" value={form.horaFin} onChange={e => setForm({...form, horaFin: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Días Disponibles</label>
            <div className="flex flex-wrap gap-3">
              {DAYS.map(day => (
                <label key={day.value} className="flex items-center gap-2 text-sm text-[#475569]">
                  <input type="checkbox" checked={form.diasDisponibles.includes(day.value)}
                    onChange={() => setForm({...form, diasDisponibles: toggleDay(form.diasDisponibles, day.value)})}
                    className="w-4 h-4 rounded border-[#e2e8f0] text-clinic-500 focus:ring-clinic-500/20 focus:ring-2" />
                  {day.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
              className="px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#475569] text-sm font-medium
                hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all duration-200">Cancelar</button>
            <button type="submit"
              className="px-5 py-2.5 rounded-xl bg-clinic-500 text-white text-sm font-medium
                hover:bg-clinic-600 active:bg-clinic-700 transition-all duration-200 shadow-sm shadow-clinic-500/20">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
