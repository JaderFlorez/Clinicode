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
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Médicos</h1>
          <p className="text-[#64748b] text-sm mt-1">Gestión de médicos registrados</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-clinic-500 text-white text-sm font-medium
            hover:bg-clinic-600 active:bg-clinic-700 transition-all duration-200 shadow-sm shadow-clinic-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Médico
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay médicos registrados" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Médico' : 'Nuevo Médico'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Nombres</label>
              <input type="text" value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all placeholder:text-[#94a3b8]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Apellidos</label>
              <input type="text" value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all placeholder:text-[#94a3b8]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">N° Licencia</label>
              <input type="text" value={form.numeroLicencia} onChange={e => setForm({...form, numeroLicencia: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all placeholder:text-[#94a3b8]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Especialidad</label>
              <select value={form.idEspecialidad} onChange={e => setForm({...form, idEspecialidad: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all" required>
                <option value="">Seleccionar especialidad...</option>
                {especialidades.map(esp => (
                  <option key={esp.idEspecialidad} value={esp.idEspecialidad}>{esp.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Teléfono</label>
              <input type="text" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all placeholder:text-[#94a3b8]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Correo</label>
              <input type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all placeholder:text-[#94a3b8]" />
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
