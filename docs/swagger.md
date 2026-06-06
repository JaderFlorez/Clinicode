# Clinicode API - Documentación Swagger

La documentación interactiva de la API está disponible en:

- **Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Servidor**: `http://localhost:3000`

## Entidades Disponibles

| Entidad | Descripción | Endpoints |
|---------|-------------|-----------|
| Pacientes | Gestión de pacientes | CRUD completo en `/api/pacientes` |
| Médicos | Gestión de médicos | CRUD completo en `/api/medicos` |
| Especialidades | Especialidades médicas | CRUD completo en `/api/especialidades` |
| Consultorios | Consultorios disponibles | CRUD completo en `/api/consultorios` |
| Agendas Médico | Agendas por médico | CRUD completo en `/api/agendas-medico` |
| Disponibilidad Consultorio | Horarios de consultorios | CRUD completo en `/api/disponibilidades-consultorio` |
| Citas Médicas | Citas agendadas | CRUD completo en `/api/citas-medicas` |

## Formato de Respuestas

Todas las respuestas siguen el formato:

### Éxito (GET list)
```json
{
  "mensaje": "Entidades encontradas correctamente",
  "entidades": [],
  "entidadesEncontradas": 0
}
```

### Éxito (GET by ID)
```json
{
  "mensaje": "Entidad encontrada correctamente",
  "entidad": {}
}
```

### Éxito (POST)
```json
{
  "mensaje": "Entidad creada correctamente",
  "idEntidad": "uuid"
}
```

### Error de Validación (400)
```json
{
  "mensaje": "Datos inválidos",
  "error": "Descripción del error"
}
```

### No Encontrado (404)
```json
{
  "mensaje": "Entidad no encontrada"
}
```

### Error del Servidor (500)
```json
{
  "mensaje": "Error al procesar la solicitud",
  "error": "Descripción del error"
}
```
