import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from '../api/pacientes'
import type { Paciente } from '../api/pacientes'

const defaultForm = {
  tipoDocumento: 'CC',
  numeroDocumento: '',
  nombres: '',
  apellidos: '',
  fechaNacimiento: '',
  telefono: '',
  correo: '',
  direccion: '',
}

const columns = [
  { key: 'nombres', label: 'Nombres' },
  { key: 'apellidos', label: 'Apellidos' },
  { key: 'numeroDocumento', label: 'Documento' },
  { key: 'tipoDocumento', label: 'Tipo Doc.' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'correo', label: 'Correo' },
  { key: 'direccion', label: 'Dirección' },
]

export default function Pacientes() {
  const [data, setData] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const res = await getPacientes()
      setData(res.data.pacientes ?? [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleEdit = (item: Paciente) => {
    setEditingId(item.idPaciente ?? null)
    setForm({
      tipoDocumento: item.tipoDocumento,
      numeroDocumento: item.numeroDocumento,
      nombres: item.nombres,
      apellidos: item.apellidos,
      fechaNacimiento: item.fechaNacimiento ? item.fechaNacimiento.toString().split('T')[0] : '',
      telefono: item.telefono,
      correo: item.correo ?? '',
      direccion: item.direccion,
    })
    setModalOpen(true)
  }

  const handleDelete = async (item: Paciente) => {
    if (!confirm(`¿Eliminar paciente ${item.nombres} ${item.apellidos}?`)) return
    try {
      await deletePaciente(item.idPaciente!)
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
        await updatePaciente(editingId, form as unknown as Paciente)
      } else {
        await createPaciente(form as unknown as Paciente)
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
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Pacientes</h1>
          <p className="text-white/50 text-sm mt-1">Gestión de pacientes registrados</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="hero-btn px-5 py-2.5 rounded-xl text-sm font-medium">
          + Nuevo Paciente
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay pacientes registrados" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Paciente' : 'Nuevo Paciente'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-500/10 text-red-400 rounded-xl">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Tipo Documento</label>
              <select value={form.tipoDocumento} onChange={e => setForm({...form, tipoDocumento: e.target.value})}
                className="hero-select w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required>
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">N° Documento</label>
              <input type="text" value={form.numeroDocumento} onChange={e => setForm({...form, numeroDocumento: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
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
              <label className="block text-sm font-medium text-white/70 mb-1">Fecha Nacimiento</label>
              <input type="date" value={form.fechaNacimiento} onChange={e => setForm({...form, fechaNacimiento: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Teléfono</label>
              <input type="text" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Correo</label>
              <input type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Dirección</label>
              <input type="text" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
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
