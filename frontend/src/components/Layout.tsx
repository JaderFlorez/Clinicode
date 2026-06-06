import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', path: '/', icon: '◈' },
  { name: 'Pacientes', path: '/pacientes', icon: '◉' },
  { name: 'Médicos', path: '/medicos', icon: '✦' },
  { name: 'Especialidades', path: '/especialidades', icon: '◆' },
  { name: 'Consultorios', path: '/consultorios', icon: '■' },
  { name: 'Agendas Médico', path: '/agendas-medico', icon: '▣' },
  { name: 'Disponibilidad', path: '/disponibilidades', icon: '◈' },
  { name: 'Citas Médicas', path: '/citas-medicas', icon: '▤' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden hero-gradient">
      {/* Sidebar móvil overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/5
        transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-clinic-400 to-clinic-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-clinic-600/30">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-[family-name:var(--font-display)] tracking-tight">
                Clinicode
              </h1>
              <p className="text-xs text-white/40 font-medium">Gestión Clínica</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }
                  `}
                >
                  <span className={`
                    text-base transition-all duration-200
                    ${isActive ? 'scale-110 text-clinic-400' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-clinic-400 rounded-full shadow-sm shadow-clinic-400/50" />
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5">
            <p className="text-xs text-white/30">Clinicode v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="glass-card border-b border-white/5">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors text-white/60"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 lg:flex-none">
              <h2 className="text-sm font-medium text-white/40">
                {navigation.find(n => n.path === location.pathname)?.name || 'Clinicode'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="http://localhost:3000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors font-medium"
              >
                API Docs
              </a>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
