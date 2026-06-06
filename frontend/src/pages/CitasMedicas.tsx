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

  const pacienteName = (id: string) => {
    const p = pacientes.find(p => p.idPaciente === id)
    return p ? `${p.nombres} ${p.apellidos}` : id
  }

  const medicoName = (id: string) => {
    const m = medicos.find(m => m.idMedico === id)
    return m ? `${m.nombres} ${m.apellidos}` : id
  }

  const columns = [
    { key: 'fechaCita', label: 'Fecha', render: (item: CitaMedica) => {
      const d = new Date(item.fechaCita)
      if (isNaN(d.getTime())) return <span>{String(item.fechaCita)}</span>
      const dia = d.getDate().toString().padStart(2, '0')
      const mes = (d.getMonth() + 1).toString().padStart(2, '0')
      const anio = d.getFullYear()
      const hora = d.getHours().toString().padStart(2, '0')
      const min = d.getMinutes().toString().padStart(2, '0')
      return (
        <span className="whitespace-nowrap">
          <span className="text-[#0f172a] font-medium">{dia}/{mes}/{anio}</span>
          <span className="text-[#94a3b8] ml-2"> {hora}:{min}</span>
        </span>
      )
    }},
    { key: 'idPaciente', label: 'Paciente', render: (item: CitaMedica) => (
      <span className="text-[#0f172a]">{pacienteName(item.idPaciente)}</span>
    )},
    { key: 'idMedico', label: 'Médico', render: (item: CitaMedica) => (
      <span className="text-[#0f172a]">{medicoName(item.idMedico)}</span>
    )},
    { key: 'motivo', label: 'Motivo' },
    { key: 'estado', label: 'Estado', render: (item: CitaMedica) => {
      const colors: Record<string, string> = {
        Programada: 'bg-clinic-50 text-clinic-700',
        Atendida: 'bg-emerald-50 text-emerald-700',
        Cancelada: 'bg-red-50 text-red-700',
      }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[item.estado] || 'bg-slate-100 text-slate-600'}`}>
          {item.estado}
        </span>
      )
    }},
  ]

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
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Citas Médicas</h1>
          <p className="text-[#64748b] text-sm mt-1">Gestión de citas médicas</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(defaultForm); setModalOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-clinic-500 text-white text-sm font-medium
            hover:bg-clinic-600 active:bg-clinic-700 transition-all duration-200 shadow-sm shadow-clinic-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Cita
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading}
        onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No hay citas registradas" />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); setForm(defaultForm) }}
        title={editingId ? 'Editar Cita' : 'Nueva Cita'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Paciente</label>
              <select value={form.idPaciente} onChange={e => setForm({...form, idPaciente: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all" required>
                <option value="">Seleccionar paciente...</option>
                {pacientes.map(p => (
                  <option key={p.idPaciente} value={p.idPaciente}>{p.nombres} {p.apellidos}</option>
                ))}
              </select>
            </div>
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
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Estado</label>
              <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all" required>
                {ESTADOS.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Fecha y Hora</label>
              <input type="datetime-local" value={form.fechaCita} onChange={e => setForm({...form, fechaCita: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Motivo</label>
              <textarea value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-sm
                  focus:border-clinic-500 focus:ring-2 focus:ring-clinic-500/20 outline-none transition-all placeholder:text-[#94a3b8]" rows={3} required />
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
