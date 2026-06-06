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
  { key: 'disponible', label: 'Disponible', render: (item: Consultorio) => item.disponible ? '✅' : '❌' },
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
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Consultorios</h1>
          <p className="text-white/50 text-sm mt-1">Gestión de consultorios</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="hero-btn px-5 py-2.5 rounded-xl text-sm font-medium">
          + Nuevo Consultorio
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay consultorios registrados" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Consultorio' : 'Nuevo Consultorio'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-500/10 text-red-400 rounded-xl">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Ubicación</label>
              <input type="text" value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
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
