import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { getMedicos, createMedico, updateMedico, deleteMedico } from '../api/medicos'
import type { Medico } from '../api/medicos'
import { getEspecialidades } from '../api/especialidades'
import type { Especialidad } from '../api/especialidades'

const defaultForm = {
  nombres: '',
  apellidos: '',
  numeroLicencia: '',
  idEspecialidad: '',
  telefono: '',
  correo: '',
}

const columns = [
  { key: 'nombres', label: 'Nombres' },
  { key: 'apellidos', label: 'Apellidos' },
  { key: 'numeroLicencia', label: 'Licencia' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'correo', label: 'Correo' },
]

export default function Medicos() {
  const [data, setData] = useState<Medico[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [res, resEsp] = await Promise.all([getMedicos(), getEspecialidades()])
      setData(res.data.medicos ?? [])
      setEspecialidades(resEsp.data.especialidades ?? [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleEdit = (item: Medico) => {
    setEditingId(item.idMedico ?? null)
    setForm({
      nombres: item.nombres,
      apellidos: item.apellidos,
      numeroLicencia: item.numeroLicencia,
      idEspecialidad: item.idEspecialidad,
      telefono: item.telefono ?? '',
      correo: item.correo ?? '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (item: Medico) => {
    if (!confirm(`¿Eliminar médico ${item.nombres} ${item.apellidos}?`)) return
    try {
      await deleteMedico(item.idMedico!)
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
        await updateMedico(editingId, form as unknown as Medico)
      } else {
        await createMedico(form as unknown as Medico)
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
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Médicos</h1>
          <p className="text-white/50 text-sm mt-1">Gestión de médicos registrados</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="hero-btn px-5 py-2.5 rounded-xl text-sm font-medium">
          + Nuevo Médico
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay médicos registrados" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Médico' : 'Nuevo Médico'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-500/10 text-red-400 rounded-xl">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Nombres</label>
              <input type="text" value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Apellidos</label>
              <input type="text" value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">N° Licencia</label>
              <input type="text" value={form.numeroLicencia} onChange={e => setForm({...form, numeroLicencia: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Especialidad</label>
              <select value={form.idEspecialidad} onChange={e => setForm({...form, idEspecialidad: e.target.value})}
                className="hero-select w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required>
                <option value="">Seleccionar especialidad...</option>
                {especialidades.map(esp => (
                  <option key={esp.idEspecialidad} value={esp.idEspecialidad}>{esp.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Teléfono</label>
              <input type="text" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Correo</label>
              <input type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" />
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
