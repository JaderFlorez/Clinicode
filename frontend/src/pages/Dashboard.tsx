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
    { title: 'Pacientes', value: '—', icon: '👤', color: 'from-clinic-500 to-clinic-600', path: '/pacientes' },
    { title: 'Médicos', value: '—', icon: '👨‍⚕️', color: 'from-emerald-500 to-emerald-600', path: '/medicos' },
    { title: 'Especialidades', value: '—', icon: '🔬', color: 'from-violet-500 to-violet-600', path: '/especialidades' },
    { title: 'Consultorios', value: '—', icon: '🏥', color: 'from-amber-500 to-amber-600', path: '/consultorios' },
    { title: 'Agendas', value: '—', icon: '📅', color: 'from-rose-500 to-rose-600', path: '/agendas-medico' },
    { title: 'Citas', value: '—', icon: '📋', color: 'from-cyan-500 to-cyan-600', path: '/citas-medicas' },
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
            const count = typeof data.pacientesEncontrados === 'number' ? data.pacientesEncontrados
              : Array.isArray(data.pacientes) ? data.pacientes.length
              : Array.isArray(data.AgendaMedico) ? data.AgendaMedico.length
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
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
          Dashboard
        </h1>
        <p className="text-white/50 mt-1">Resumen general del sistema de gestión clínica</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.path}
            className="group relative overflow-hidden rounded-2xl glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/50">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1 font-[family-name:var(--font-display)]">
                  {stat.value}
                </p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} 
              scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white font-[family-name:var(--font-display)] mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Nuevo Paciente', path: '/pacientes', icon: '➕' },
            { label: 'Nuevo Médico', path: '/medicos', icon: '➕' },
            { label: 'Nueva Cita', path: '/citas-medicas', icon: '➕' },
            { label: 'Ver API Docs', path: 'http://localhost:3000/docs', icon: '📖', external: true },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass-card border border-white/10
                hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white/70"
            >
              <span>{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl bg-gradient-to-br from-clinic-600 to-clinic-800 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <span className="text-xl">⚕️</span>
          </div>
          <div>
            <h3 className="font-bold text-lg font-[family-name:var(--font-display)]">Clinicode API</h3>
            <p className="text-clinic-100 text-sm mt-1">
              API RESTful para la gestión integral de clínicas médicas. Documentación interactiva disponible en Swagger UI.
            </p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm">Fastify</span>
              <span className="text-xs px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm">PostgreSQL</span>
              <span className="text-xs px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm">TypeScript</span>
              <span className="text-xs px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm">React</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
