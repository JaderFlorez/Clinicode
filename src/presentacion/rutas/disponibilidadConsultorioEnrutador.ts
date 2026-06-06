import { crearDisponibilidadConsultorioControlador, listarDisponibilidadesConsultorioControlador, obtenerDisponibilidadConsultorioPorIdControlador } from "../controladores/disponibilidadConsultorioControlador.js";
import { actualizarDisponibilidadConsultorioControlador, eliminarDisponibilidadConsultorioControlador } from "../controladores/disponibilidadConsultorioControlador.js";
import { FastifyInstance } from "fastify";

export async function disponibilidadConsultorioEnrutador(app: FastifyInstance) {
    app.get('/disponibilidades-consultorio', {
        schema: {
            tags: ['Disponibilidad Consultorios'],
            description: 'Listar todas las disponibilidades de consultorios',
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
                        disponibilidades: { type: 'array' },
                        disponibilidadesEncontradas: { type: 'integer' }
                    }
                }
            }
        }
    }, listarDisponibilidadesConsultorioControlador);

    app.get('/disponibilidades-consultorio/:idDisponibilidad', {
        schema: {
            tags: ['Disponibilidad Consultorios'],
            description: 'Obtener una disponibilidad por ID',
            params: {
                type: 'object',
                properties: {
                    idDisponibilidad: { type: 'string', description: 'UUID de la disponibilidad' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, disponibilidad: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, obtenerDisponibilidadConsultorioPorIdControlador);

    app.post('/disponibilidades-consultorio', {
        schema: {
            tags: ['Disponibilidad Consultorios'],
            description: 'Crear una nueva disponibilidad de consultorio',
            body: {
                type: 'object',
                required: ['idConsultorio', 'diaSemana', 'horaInicio', 'horaFin'],
                properties: {
                    idConsultorio: { type: 'string' },
                    diaSemana: { type: 'string' },
                    horaInicio: { type: 'string' },
                    horaFin: { type: 'string' },
                    disponible: { type: 'boolean' }
                }
            },
            response: {
                201: { type: 'object', properties: { mensaje: { type: 'string' }, idDisponibilidad: { type: 'string' } } },
                400: { type: 'object', properties: { mensaje: { type: 'string' }, error: { type: 'string' } } }
            }
        }
    }, crearDisponibilidadConsultorioControlador);

    app.put('/disponibilidades-consultorio/:idDisponibilidad', {
        schema: {
            tags: ['Disponibilidad Consultorios'],
            description: 'Actualizar una disponibilidad',
            params: {
                type: 'object',
                properties: { idDisponibilidad: { type: 'string', description: 'UUID de la disponibilidad' } }
            },
            body: {
                type: 'object',
                properties: {
                    idConsultorio: { type: 'string' },
                    diaSemana: { type: 'string' },
                    horaInicio: { type: 'string' },
                    horaFin: { type: 'string' },
                    disponible: { type: 'boolean' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, disponibilidadActualizada: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, actualizarDisponibilidadConsultorioControlador);

    app.delete('/disponibilidades-consultorio/:idDisponibilidad', {
        schema: {
            tags: ['Disponibilidad Consultorios'],
            description: 'Eliminar una disponibilidad',
            params: {
                type: 'object',
                properties: { idDisponibilidad: { type: 'string', description: 'UUID de la disponibilidad' } }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, idDisponibilidad: { type: 'string' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, eliminarDisponibilidadConsultorioControlador);
};
