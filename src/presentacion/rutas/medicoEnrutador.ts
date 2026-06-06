import { crearMedicoControlador, listarMedicosControlador, obtenerMedicoPorIdControlador } from "../controladores/medicoControlador.js";
import { actualizarMedicoControlador, eliminarMedicoControlador } from "../controladores/medicoControlador.js";
import { FastifyInstance } from "fastify";

export async function medicoEnrutador(app: FastifyInstance) {
    app.get('/medicos', {
        schema: {
            tags: ['Médicos'],
            description: 'Listar todos los médicos',
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
                        medicos: { type: 'array' },
                        medicosEncontrados: { type: 'integer' }
                    }
                }
            }
        }
    }, listarMedicosControlador);

    app.get('/medicos/:idMedico', {
        schema: {
            tags: ['Médicos'],
            description: 'Obtener un médico por ID',
            params: {
                type: 'object',
                properties: {
                    idMedico: { type: 'string', description: 'UUID del médico' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, medico: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, obtenerMedicoPorIdControlador);

    app.post('/medicos', {
        schema: {
            tags: ['Médicos'],
            description: 'Crear un nuevo médico',
            body: {
                type: 'object',
                required: ['nombres', 'apellidos', 'numeroLicencia', 'idEspecialidad'],
                properties: {
                    nombres: { type: 'string' },
                    apellidos: { type: 'string' },
                    numeroLicencia: { type: 'string' },
                    idEspecialidad: { type: 'string' },
                    telefono: { type: 'string' },
                    correo: { type: 'string' }
                }
            },
            response: {
                201: { type: 'object', properties: { mensaje: { type: 'string' }, idMedico: { type: 'string' } } },
                400: { type: 'object', properties: { mensaje: { type: 'string' }, error: { type: 'string' } } }
            }
        }
    }, crearMedicoControlador);

    app.put('/medicos/:idMedico', {
        schema: {
            tags: ['Médicos'],
            description: 'Actualizar un médico',
            params: {
                type: 'object',
                properties: { idMedico: { type: 'string', description: 'UUID del médico' } }
            },
            body: {
                type: 'object',
                properties: {
                    nombres: { type: 'string' },
                    apellidos: { type: 'string' },
                    numeroLicencia: { type: 'string' },
                    idEspecialidad: { type: 'string' },
                    telefono: { type: 'string' },
                    correo: { type: 'string' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, medicoActualizado: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, actualizarMedicoControlador);

    app.delete('/medicos/:idMedico', {
        schema: {
            tags: ['Médicos'],
            description: 'Eliminar un médico',
            params: {
                type: 'object',
                properties: { idMedico: { type: 'string', description: 'UUID del médico' } }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, idMedico: { type: 'string' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, eliminarMedicoControlador);
};
