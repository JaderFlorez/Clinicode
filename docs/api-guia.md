# Guía de la API de Clinicode

## Introducción

Clinicode API es un sistema de gestión clínica que permite administrar pacientes, médicos, especialidades, consultorios, agendas y citas médicas.

## Tecnologías

- **Runtime**: Node.js con TypeScript
- **Framework**: Fastify 5
- **Base de datos**: PostgreSQL
- **Validación**: Zod
- **Documentación**: Swagger UI (OpenAPI 3.0)

## Configuración

1. Clonar el repositorio
2. Ejecutar `npm install`
3. Configurar variables de entorno en `.env`
4. Ejecutar migraciones de `migraciones/migraciones.sql`
5. Iniciar con `npm run dev`

## Endpoints

### Base URL: `http://localhost:3000/api`

### Pacientes
- `GET /pacientes` - Listar pacientes
- `GET /pacientes/:idPaciente` - Obtener paciente por ID
- `POST /pacientes` - Crear paciente
- `PUT /pacientes/:idPaciente` - Actualizar paciente
- `DELETE /pacientes/:idPaciente` - Eliminar paciente

### Médicos
- `GET /medicos` - Listar médicos
- `GET /medicos/:idMedico` - Obtener médico por ID
- `POST /medicos` - Crear médico
- `PUT /medicos/:idMedico` - Actualizar médico
- `DELETE /medicos/:idMedico` - Eliminar médico

### Especialidades
- `GET /especialidades` - Listar especialidades
- `GET /especialidades/:idEspecialidad` - Obtener especialidad por ID
- `POST /especialidades` - Crear especialidad
- `PUT /especialidades/:idEspecialidad` - Actualizar especialidad
- `DELETE /especialidades/:idEspecialidad` - Eliminar especialidad

### Consultorios
- `GET /consultorios` - Listar consultorios
- `GET /consultorios/:idConsultorio` - Obtener consultorio por ID
- `POST /consultorios` - Crear consultorio
- `PUT /consultorios/:idConsultorio` - Actualizar consultorio
- `DELETE /consultorios/:idConsultorio` - Eliminar consultorio

### Agendas Médico
- `GET /agendas-medico` - Listar agendas
- `GET /agendas-medico/:idAgenda` - Obtener agenda por ID
- `POST /agendas-medico` - Crear agenda
- `PUT /agendas-medico/:idAgenda` - Actualizar agenda
- `DELETE /agendas-medico/:idAgenda` - Eliminar agenda

### Disponibilidad Consultorios
- `GET /disponibilidades-consultorio` - Listar disponibilidades
- `GET /disponibilidades-consultorio/:idDisponibilidad` - Obtener disponibilidad por ID
- `POST /disponibilidades-consultorio` - Crear disponibilidad
- `PUT /disponibilidades-consultorio/:idDisponibilidad` - Actualizar disponibilidad
- `DELETE /disponibilidades-consultorio/:idDisponibilidad` - Eliminar disponibilidad

### Citas Médicas
- `GET /citas-medicas` - Listar citas
- `GET /citas-medicas/:idCita` - Obtener cita por ID
- `POST /citas-medicas` - Crear cita
- `PUT /citas-medicas/:idCita` - Actualizar cita
- `DELETE /citas-medicas/:idCita` - Eliminar cita
