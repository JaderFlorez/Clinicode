import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { getDisponibilidades, createDisponibilidad, updateDisponibilidad, deleteDisponibilidad } from '../api/disponibilidades'
import type { DisponibilidadConsultorio as DisponibilidadType } from '../api/disponibilidades'
import { getConsultorios } from '../api/consultorios'
import type { Consultorio } from '../api/consultorios'

const DAYS_OF_WEEK = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
]

const defaultForm = {
  idConsultorio: '',
  diaSemana: 'Lunes',
  horaInicio: '',
  horaFin: '',
  disponible: true,
}

const columns = [
  { key: 'diaSemana', label: 'Día' },
  { key: 'horaInicio', label: 'Hora Inicio' },
  { key: 'horaFin', label: 'Hora Fin' },
  { key: 'disponible', label: 'Disponible', render: (item: DisponibilidadType) => item.disponible ? '✅' : '❌' },
]

export default function DisponibilidadConsultorio() {
  const [data, setData] = useState<DisponibilidadType[]>([])
  const [consultorios, setConsultorios] = useState<Consultorio[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [res, resCon] = await Promise.allSettled([getDisponibilidades(), getConsultorios()])
      if (res.status === 'fulfilled') setData(res.value.data.disponibilidades ?? [])
      if (resCon.status === 'fulfilled') setConsultorios(resCon.value.data.consultorios ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleEdit = (item: DisponibilidadType) => {
    setEditingId(item.idDisponibilidad ?? null)
    setForm({
      idConsultorio: item.idConsultorio,
      diaSemana: item.diaSemana,
      horaInicio: item.horaInicio,
      horaFin: item.horaFin,
      disponible: item.disponible,
    })
    setModalOpen(true)
  }

  const handleDelete = async (item: DisponibilidadType) => {
    if (!confirm('¿Eliminar esta disponibilidad?')) return
    try {
      await deleteDisponibilidad(item.idDisponibilidad!)
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
        await updateDisponibilidad(editingId, form as unknown as DisponibilidadType)
      } else {
        await createDisponibilidad(form as unknown as DisponibilidadType)
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
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Disponibilidad Consultorios</h1>
          <p className="text-white/50 text-sm mt-1">Gestión de disponibilidad por consultorio</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="hero-btn px-5 py-2.5 rounded-xl text-sm font-medium">
          + Nueva Disponibilidad
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay disponibilidades registradas" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Disponibilidad' : 'Nueva Disponibilidad'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-500/10 text-red-400 rounded-xl">{error}</div>}
          <div className="space-y-4">
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
              <label className="block text-sm font-medium text-white/70 mb-1">Día de la Semana</label>
              <select value={form.diaSemana} onChange={e => setForm({...form, diaSemana: e.target.value})}
                className="hero-select w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required>
                {DAYS_OF_WEEK.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <div className="flex items-center gap-2">
              <input type="checkbox" id="disponible" checked={form.disponible}
                onChange={e => setForm({...form, disponible: e.target.checked})}
                className="w-4 h-4 rounded border-white/10 text-clinic-400 focus:ring-clinic-500" />
              <label htmlFor="disponible" className="text-sm font-medium text-white/70">Disponible</label>
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
