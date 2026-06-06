import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import Medicos from './pages/Medicos'
import Especialidades from './pages/Especialidades'
import Consultorios from './pages/Consultorios'
import AgendasMedico from './pages/AgendasMedico'
import DisponibilidadConsultorio from './pages/DisponibilidadConsultorio'
import CitasMedicas from './pages/CitasMedicas'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/medicos" element={<Medicos />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/consultorios" element={<Consultorios />} />
        <Route path="/agendas-medico" element={<AgendasMedico />} />
        <Route path="/disponibilidades" element={<DisponibilidadConsultorio />} />
        <Route path="/citas-medicas" element={<CitasMedicas />} />
      </Route>
    </Routes>
  )
}

export default App
