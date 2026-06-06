import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { getConsultorios, createConsultorio, updateConsultorio, deleteConsultorio } from '../api/consultorios'
import type { Consultorio } from '../api/consultorios'

const defaultForm = {
  nombre: '',
  ubicacion: '',
  disponible: true,
}

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'ubicacion', label: 'Ubicación' },
  { key: 'disponible', label: 'Disponible', render: (item: Consultorio) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
      item.disponible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${item.disponible ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {item.disponible ? 'Disponible' : 'No disponible'}
    </span>
  )},
]

export default function Consultorios() {
  const [data, setData] = useState<Consultorio[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const res = await getConsultorios()
      setData(res.data.consultorios ?? [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleEdit = (item: Consultorio) => {
    setEditingId(item.idConsultorio ?? null)
    setForm({
      nombre: item.nombre,
      ubicacion: item.ubicacion,
      disponible: item.disponible,
    })
    setModalOpen(true)
  }

  const handleDelete = async (item: Consultorio) => {
    if (!confirm(`¿Eliminar consultorio ${item.nombre}?`)) return
    try {
      await deleteConsultorio(item.idConsultorio!)
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
        await updateConsultorio(editingId, form as unknown as Consultorio)
      } else {
        await createConsultorio(form as unknown as Consultorio)
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
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Consultorios</h1>
          <p className="text-[#64748b] text-sm mt-1">Gestión de consultorios</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-clinic-500 text-white text-sm font-medium
            hover:bg-clinic-600 active:bg-clinic-700 transition-all duration-200 shadow-sm shadow-clinic-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Consultorio
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay consultorios registrados" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Consultorio' : 'Nuevo Consultorio'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all placeholder:text-[#94a3b8]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Ubicación</label>
              <input type="text" value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all placeholder:text-[#94a3b8]" required />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="disponible" checked={form.disponible}
                onChange={e => setForm({...form, disponible: e.target.checked})}
                className="w-4 h-4 rounded border-[#e2e8f0] text-clinic-500 focus:ring-clinic-500/20 focus:ring-2" />
              <label htmlFor="disponible" className="text-sm font-medium text-[#475569]">Disponible</label>
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
