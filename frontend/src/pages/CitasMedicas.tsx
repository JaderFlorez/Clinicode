import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { getCitas, createCita, updateCita, deleteCita } from '../api/citas'
import type { CitaMedica } from '../api/citas'
import { getPacientes } from '../api/pacientes'
import type { Paciente } from '../api/pacientes'
import { getMedicos } from '../api/medicos'
import type { Medico } from '../api/medicos'
import { getConsultorios } from '../api/consultorios'
import type { Consultorio } from '../api/consultorios'

const ESTADOS = ['Programada', 'Atendida', 'Cancelada']

const defaultForm = {
  idPaciente: '',
  idMedico: '',
  idConsultorio: '',
  fechaCita: '',
  motivo: '',
  estado: 'Programada',
}

const columns = [
  { key: 'fechaCita', label: 'Fecha Cita' },
  { key: 'motivo', label: 'Motivo' },
  { key: 'estado', label: 'Estado' },
]

export default function CitasMedicas() {
  const [data, setData] = useState<CitaMedica[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [consultorios, setConsultorios] = useState<Consultorio[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [res, resPac, resMed, resCon] = await Promise.allSettled([
        getCitas(), getPacientes(), getMedicos(), getConsultorios(),
      ])
      if (res.status === 'fulfilled') setData(res.value.data.citas ?? [])
      if (resPac.status === 'fulfilled') setPacientes(resPac.value.data.pacientes ?? [])
      if (resMed.status === 'fulfilled') setMedicos(resMed.value.data.medicos ?? [])
      if (resCon.status === 'fulfilled') setConsultorios(resCon.value.data.consultorios ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleEdit = (item: CitaMedica) => {
    setEditingId(item.idCita ?? null)
    setForm({
      idPaciente: item.idPaciente,
      idMedico: item.idMedico,
      idConsultorio: item.idConsultorio,
      fechaCita: item.fechaCita ? item.fechaCita.toString().slice(0, 16) : '',
      motivo: item.motivo,
      estado: item.estado,
    })
    setModalOpen(true)
  }

  const handleDelete = async (item: CitaMedica) => {
    if (!confirm('¿Eliminar esta cita médica?')) return
    try {
      await deleteCita(item.idCita!)
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
        await updateCita(editingId, form as unknown as CitaMedica)
      } else {
        await createCita(form as unknown as CitaMedica)
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
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Citas Médicas</h1>
          <p className="text-white/50 text-sm mt-1">Gestión de citas médicas</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="hero-btn px-5 py-2.5 rounded-xl text-sm font-medium">
          + Nueva Cita
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay citas registradas" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Cita' : 'Nueva Cita'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-500/10 text-red-400 rounded-xl">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Paciente</label>
              <select value={form.idPaciente} onChange={e => setForm({...form, idPaciente: e.target.value})}
                className="hero-select w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required>
                <option value="">Seleccionar paciente...</option>
                {pacientes.map(p => (
                  <option key={p.idPaciente} value={p.idPaciente}>{p.nombres} {p.apellidos}</option>
                ))}
              </select>
            </div>
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
              <label className="block text-sm font-medium text-white/70 mb-1">Estado</label>
              <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}
                className="hero-select w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required>
                {ESTADOS.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-1">Fecha y Hora</label>
              <input type="datetime-local" value={form.fechaCita} onChange={e => setForm({...form, fechaCita: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-1">Motivo</label>
              <textarea value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})}
                className="hero-input w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-200 outline-none transition-all text-sm" rows={3} required />
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
