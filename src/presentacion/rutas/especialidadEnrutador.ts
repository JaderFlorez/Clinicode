import { crearEspecialidadControlador, listarEspecialidadesControlador, obtenerEspecialidadPorIdControlador } from "../controladores/especialidadControlador.js";
import { actualizarEspecialidadControlador, eliminarEspecialidadControlador } from "../controladores/especialidadControlador.js";
import { FastifyInstance } from "fastify";

export async function especialidadEnrutador(app: FastifyInstance) {
    app.get('/especialidades', {
        schema: {
            tags: ['Especialidades'],
            description: 'Listar todas las especialidades',
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
                        especialidades: { type: 'array' },
                        especialidadesEncontradas: { type: 'integer' }
                    }
                }
            }
        }
    }, listarEspecialidadesControlador);

    app.get('/especialidades/:idEspecialidad', {
        schema: {
            tags: ['Especialidades'],
            description: 'Obtener una especialidad por ID',
            params: {
                type: 'object',
                properties: {
                    idEspecialidad: { type: 'string', description: 'UUID de la especialidad' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, especialidad: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, obtenerEspecialidadPorIdControlador);

    app.post('/especialidades', {
        schema: {
            tags: ['Especialidades'],
            description: 'Crear una nueva especialidad',
            body: {
                type: 'object',
                required: ['nombre'],
                properties: {
                    nombre: { type: 'string' },
                    descripcion: { type: 'string' }
                }
            },
            response: {
                201: { type: 'object', properties: { mensaje: { type: 'string' }, idEspecialidad: { type: 'string' } } },
                400: { type: 'object', properties: { mensaje: { type: 'string' }, error: { type: 'string' } } }
            }
        }
    }, crearEspecialidadControlador);

    app.put('/especialidades/:idEspecialidad', {
        schema: {
            tags: ['Especialidades'],
            description: 'Actualizar una especialidad',
            params: {
                type: 'object',
                properties: { idEspecialidad: { type: 'string', description: 'UUID de la especialidad' } }
            },
            body: {
                type: 'object',
                properties: {
                    nombre: { type: 'string' },
                    descripcion: { type: 'string' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, especialidadActualizada: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, actualizarEspecialidadControlador);

    app.delete('/especialidades/:idEspecialidad', {
        schema: {
            tags: ['Especialidades'],
            description: 'Eliminar una especialidad',
            params: {
                type: 'object',
                properties: { idEspecialidad: { type: 'string', description: 'UUID de la especialidad' } }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, idEspecialidad: { type: 'string' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, eliminarEspecialidadControlador);
};
