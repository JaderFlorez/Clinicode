import { crearAgendaMedicoControlador, listarAgendaMedicoControlador } from "../controladores/agendaMedicoControlador.js";
import { obtenerAgendaPorIdControlador, actualizarAgendaMedicoControlador } from "../controladores/agendaMedicoControlador.js";
import { eliminarAgendaControlador } from "../controladores/agendaMedicoControlador.js";
import { FastifyInstance } from "fastify";

export async function agendaMedicoEnrutador (app: FastifyInstance){
    app.get('/agendas-medico', {
        schema: {
            tags: ['Agendas Médico'],
            description: 'Listar todas las agendas de médicos',
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
                        AgendaMedico: { type: 'array' },
                        TotalAgendamientos: { type: 'integer' }
                    }
                }
            }
        }
    }, listarAgendaMedicoControlador);

    app.get('/agendas-medico/:idAgenda', {
        schema: {
            tags: ['Agendas Médico'],
            description: 'Obtener una agenda por ID',
            params: {
                type: 'object',
                properties: {
                    idAgenda: { type: 'string', description: 'UUID de la agenda' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, AgendaMédico: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, obtenerAgendaPorIdControlador);

    app.post('/agendas-medico', {
        schema: {
            tags: ['Agendas Médico'],
            description: 'Crear una nueva agenda para un médico',
            body: {
                type: 'object',
                required: ['idMedico', 'idConsultorio', 'diasDisponibles', 'horaInicio', 'horaFin'],
                properties: {
                    idMedico: { type: 'string' },
                    idConsultorio: { type: 'string' },
                    diasDisponibles: { type: 'array', items: { type: 'string' } },
                    horaInicio: { type: 'string' },
                    horaFin: { type: 'string' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, idAgenda: { type: 'string' } } },
                400: { type: 'object', properties: { mensaje: { type: 'string' }, error: { type: 'string' } } }
            }
        }
    }, crearAgendaMedicoControlador);

    app.put('/agendas-medico/:idAgenda', {
        schema: {
            tags: ['Agendas Médico'],
            description: 'Actualizar una agenda',
            params: {
                type: 'object',
                properties: { idAgenda: { type: 'string', description: 'UUID de la agenda' } }
            },
            body: {
                type: 'object',
                properties: {
                    idMedico: { type: 'string' },
                    idConsultorio: { type: 'string' },
                    diasDisponibles: { type: 'array', items: { type: 'string' } },
                    horaInicio: { type: 'string' },
                    horaFin: { type: 'string' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, AgendaActualizada: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, actualizarAgendaMedicoControlador);

    app.delete('/agendas-medico/:idAgenda', {
        schema: {
            tags: ['Agendas Médico'],
            description: 'Eliminar una agenda',
            params: {
                type: 'object',
                properties: { idAgenda: { type: 'string', description: 'UUID de la agenda' } }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, idAgenda: { type: 'string' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, eliminarAgendaControlador);
};
