
import { crearConsultorioControlador, listarConsultoriosControlador, obtenerConsultorioPorIdControlador } from "../controladores/consultorioControlador.js";
import { actualizarConsultorioControlador, eliminarConsultorioControlador } from "../controladores/consultorioControlador.js";
import { FastifyInstance } from "fastify";

export async function consultorioEnrutador(app: FastifyInstance) {
    app.get('/consultorios', {
        schema: {
            tags: ['Consultorios'],
            description: 'Listar todos los consultorios',
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
                        consultorios: { type: 'array' },
                        consultoriosEncontrados: { type: 'integer' }
                    }
                }
            }
        }
    }, listarConsultoriosControlador);

    app.get('/consultorios/:idConsultorio', {
        schema: {
            tags: ['Consultorios'],
            description: 'Obtener un consultorio por ID',
            params: {
                type: 'object',
                properties: {
                    idConsultorio: { type: 'string', description: 'UUID del consultorio' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, consultorio: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, obtenerConsultorioPorIdControlador);

    app.post('/consultorios', {
        schema: {
            tags: ['Consultorios'],
            description: 'Crear un nuevo consultorio',
            body: {
                type: 'object',
                required: ['nombre'],
                properties: {
                    nombre: { type: 'string' },
                    ubicacion: { type: 'string' },
                    disponible: { type: 'boolean' }
                }
            },
            response: {
                201: { type: 'object', properties: { mensaje: { type: 'string' }, idConsultorio: { type: 'string' } } },
                400: { type: 'object', properties: { mensaje: { type: 'string' }, error: { type: 'string' } } }
            }
        }
    }, crearConsultorioControlador);

    app.put('/consultorios/:idConsultorio', {
        schema: {
            tags: ['Consultorios'],
            description: 'Actualizar un consultorio',
            params: {
                type: 'object',
                properties: { idConsultorio: { type: 'string', description: 'UUID del consultorio' } }
            },
            body: {
                type: 'object',
                properties: {
                    nombre: { type: 'string' },
                    ubicacion: { type: 'string' },
                    disponible: { type: 'boolean' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, consultorioActualizado: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, actualizarConsultorioControlador);

    app.delete('/consultorios/:idConsultorio', {
        schema: {
            tags: ['Consultorios'],
            description: 'Eliminar un consultorio',
            params: {
                type: 'object',
                properties: { idConsultorio: { type: 'string', description: 'UUID del consultorio' } }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, idConsultorio: { type: 'string' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, eliminarConsultorioControlador);
};

