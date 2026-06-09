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

export default function DisponibilidadConsultorio() {
  const [data, setData] = useState<DisponibilidadType[]>([])
  const [consultorios, setConsultorios] = useState<Consultorio[]>([])

  const consultorioInfo = (id: string) => {
    const c = consultorios.find(c => c.idConsultorio === id)
    return c ? { nombre: c.nombre, ubicacion: c.ubicacion } : null
  }

  const columns = [
    { key: 'idConsultorio', label: 'Consultorio', render: (item: DisponibilidadType) => {
      const info = consultorioInfo(item.idConsultorio)
      return info ? (
        <div>
          <span className="text-[#0f172a] font-medium">{info.nombre}</span>
          <span className="text-[#94a3b8] ml-2">· {info.ubicacion}</span>
        </div>
      ) : item.idConsultorio
    }},
    { key: 'diaSemana', label: 'Día' },
    { key: 'horaInicio', label: 'Hora Inicio' },
    { key: 'horaFin', label: 'Hora Fin' },
    { key: 'disponible', label: 'Disponible', render: (item: DisponibilidadType) => (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        item.disponible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${item.disponible ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        {item.disponible ? 'Disponible' : 'No disponible'}
      </span>
    )},
  ]
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
      const axiosError = err as { response?: { data?: { error?: string; mensaje?: string } } }
      setError(axiosError.response?.data?.mensaje || axiosError.response?.data?.error || 'Error al guardar')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Disponibilidad Consultorios</h1>
          <p className="text-[#64748b] text-sm mt-1">Gestión de disponibilidad por consultorio</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true); setError('') }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-clinic-500 text-white text-sm font-medium
            hover:bg-clinic-600 active:bg-clinic-700 transition-all duration-200 shadow-sm shadow-clinic-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Disponibilidad
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay disponibilidades registradas" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm); setError('') }}
        title={editingId ? 'Editar Disponibilidad' : 'Nueva Disponibilidad'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}
          <div className="space-y-4">
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
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Día de la Semana</label>
              <select value={form.diaSemana} onChange={e => setForm({...form, diaSemana: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all" required>
                {DAYS_OF_WEEK.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <div className="flex items-center gap-2">
              <input type="checkbox" id="disponible" checked={form.disponible}
                onChange={e => setForm({...form, disponible: e.target.checked})}
                className="w-4 h-4 rounded border-[#e2e8f0] text-clinic-500 focus:ring-clinic-500/20 focus:ring-2" />
              <label htmlFor="disponible" className="text-sm font-medium text-[#475569]">Disponible</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm); setError('') }}
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
