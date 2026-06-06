import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

interface StatCard {
  title: string
  value: string | number
  icon: string
  color: string
  path: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    { title: 'Pacientes', value: '—', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'from-clinic-500 to-clinic-600', path: '/pacientes' },
    { title: 'Médicos', value: '—', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'from-emerald-500 to-emerald-600', path: '/medicos' },
    { title: 'Especialidades', value: '—', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', color: 'from-violet-500 to-violet-600', path: '/especialidades' },
    { title: 'Consultorios', value: '—', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'from-amber-500 to-amber-600', path: '/consultorios' },
    { title: 'Agendas', value: '—', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'from-rose-500 to-rose-600', path: '/agendas-medico' },
    { title: 'Citas', value: '—', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'from-cyan-500 to-cyan-600', path: '/citas-medicas' },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pacResp, medResp, espResp, conResp, ageResp, citResp] = await Promise.allSettled([
          api.get('/pacientes'),
          api.get('/medicos'),
          api.get('/especialidades'),
          api.get('/consultorios'),
          api.get('/agendas-medico'),
          api.get('/citas-medicas'),
        ])

        setStats(prev => prev.map((stat, i) => {
          const responses = [pacResp, medResp, espResp, conResp, ageResp, citResp]
          const resp = responses[i]
          if (resp.status === 'fulfilled') {
            const data = resp.value.data as Record<string, unknown>
            const count
              = typeof data.pacientesEncontrados === 'number' ? data.pacientesEncontrados
              : typeof data.medicosEncontrados === 'number' ? data.medicosEncontrados
              : typeof data.especialidadesEncontradas === 'number' ? data.especialidadesEncontradas
              : typeof data.consultoriosEncontrados === 'number' ? data.consultoriosEncontrados
              : typeof data.TotalAgendamientos === 'number' ? data.TotalAgendamientos
              : typeof data.citasEncontradas === 'number' ? data.citasEncontradas
              : typeof data.disponibilidadesEncontradas === 'number' ? data.disponibilidadesEncontradas
              : Array.isArray(data.AgendaMedico) ? data.AgendaMedico.length
              : Array.isArray(data.pacientes) ? data.pacientes.length
              : '—'
            return { ...stat, value: count }
          }
          return stat
        }))
      } catch {
        // Silently fail
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
          Dashboard
        </h1>
        <p className="text-[#64748b] mt-1">Resumen general del sistema de gestión clínica</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.path}
            className="group relative overflow-hidden rounded-2xl bg-white border border-[#e2e8f0] p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#64748b]">{stat.title}</p>
                <p className="text-3xl font-bold text-[#0f172a] mt-1 tracking-tight">
                  {stat.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} 
              scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`} />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-[#0f172a] mb-4 tracking-tight">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Nuevo Paciente', path: '/pacientes', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
            { label: 'Nuevo Médico', path: '/medicos', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
            { label: 'Nueva Cita', path: '/citas-medicas', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
            { label: 'Ver API Docs', path: 'http://localhost:3000/docs', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', external: true },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#e2e8f0]
                hover:border-clinic-200 hover:shadow-sm transition-all duration-200 text-sm font-medium text-[#475569] hover:text-clinic-600"
            >
              <div className="w-8 h-8 rounded-lg bg-[#f8fafc] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                </svg>
              </div>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
