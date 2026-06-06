import { crearCitaMedicaControlador, listarCitasMedicasControlador, obtenerCitaMedicaPorIdControlador } from "../controladores/citaMedicaControlador.js";
import { actualizarCitaMedicaControlador, eliminarCitaMedicaControlador } from "../controladores/citaMedicaControlador.js";
import { FastifyInstance } from "fastify";

export async function citaMedicaEnrutador(app: FastifyInstance) {
    app.get('/citas-medicas', {
        schema: {
            tags: ['Citas Médicas'],
            description: 'Listar todas las citas médicas',
            querystring: {
                type: 'object',
                properties: {
                    limite: { type: 'integer', description: 'Cantidad máxima de resultados' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        mensaje: { type: 'string' },
                        citas: { type: 'array' },
                        citasEncontradas: { type: 'integer' }
                    }
                }
            }
        }
    }, listarCitasMedicasControlador);

    app.get('/citas-medicas/:idCita', {
        schema: {
            tags: ['Citas Médicas'],
            description: 'Obtener una cita médica por ID',
            params: {
                type: 'object',
                properties: {
                    idCita: { type: 'string', description: 'UUID de la cita' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, cita: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, obtenerCitaMedicaPorIdControlador);

    app.post('/citas-medicas', {
        schema: {
            tags: ['Citas Médicas'],
            description: 'Crear una nueva cita médica',
            body: {
                type: 'object',
                required: ['idPaciente', 'idMedico', 'idConsultorio', 'fechaCita'],
                properties: {
                    idPaciente: { type: 'string' },
                    idMedico: { type: 'string' },
                    idConsultorio: { type: 'string' },
                    fechaCita: { type: 'string' },
                    motivo: { type: 'string' },
                    estado: { type: 'string' }
                }
            },
            response: {
                201: { type: 'object', properties: { mensaje: { type: 'string' }, idCita: { type: 'string' } } },
                400: { type: 'object', properties: { mensaje: { type: 'string' }, error: { type: 'string' } } }
            }
        }
    }, crearCitaMedicaControlador);

    app.put('/citas-medicas/:idCita', {
        schema: {
            tags: ['Citas Médicas'],
            description: 'Actualizar una cita médica',
            params: {
                type: 'object',
                properties: { idCita: { type: 'string', description: 'UUID de la cita' } }
            },
            body: {
                type: 'object',
                properties: {
                    idPaciente: { type: 'string' },
                    idMedico: { type: 'string' },
                    idConsultorio: { type: 'string' },
                    fechaCita: { type: 'string' },
                    motivo: { type: 'string' },
                    estado: { type: 'string' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, citaActualizada: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, actualizarCitaMedicaControlador);

    app.delete('/citas-medicas/:idCita', {
        schema: {
            tags: ['Citas Médicas'],
            description: 'Eliminar una cita médica',
            params: {
                type: 'object',
                properties: { idCita: { type: 'string', description: 'UUID de la cita' } }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, idCita: { type: 'string' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, eliminarCitaMedicaControlador);
};
