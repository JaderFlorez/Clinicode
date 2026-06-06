import { crearPacienteControlador, listarPacienesControlador, obtenerPacientePorIdControlador } from "../controladores/pacienteControlador.js";
import { actualizarPacienteControlador, eliminarPacienteControlador } from "../controladores/pacienteControlador.js";
import { FastifyInstance } from "fastify";

export async function pacienteEnrutador(app: FastifyInstance) {
    app.get('/pacientes', {
        schema: {
            tags: ['Pacientes'],
            description: 'Listar todos los pacientes',
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
                        pacientes: { type: 'array' },
                        pacientesEncontrados: { type: 'integer' }
                    }
                }
            }
        }
    }, listarPacienesControlador);

    app.get('/pacientes/:idPaciente', {
        schema: {
            tags: ['Pacientes'],
            description: 'Obtener un paciente por ID',
            params: {
                type: 'object',
                properties: {
                    idPaciente: { type: 'string', description: 'UUID del paciente' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, Paciente: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, obtenerPacientePorIdControlador);

    app.post('/pacientes', {
        schema: {
            tags: ['Pacientes'],
            description: 'Crear un nuevo paciente',
            body: {
                type: 'object',
                required: ['tipoDocumento', 'numeroDocumento', 'nombres', 'apellidos', 'fechaNacimiento', 'telefono', 'direccion'],
                properties: {
                    tipoDocumento: { type: 'string' },
                    numeroDocumento: { type: 'string' },
                    nombres: { type: 'string' },
                    apellidos: { type: 'string' },
                    fechaNacimiento: { type: 'string' },
                    telefono: { type: 'string' },
                    correo: { type: 'string' },
                    direccion: { type: 'string' }
                }
            },
            response: {
                201: { type: 'object', properties: { mensaje: { type: 'string' }, idPaciente: { type: 'string' } } },
                400: { type: 'object', properties: { mensaje: { type: 'string' }, error: { type: 'string' } } }
            }
        }
    }, crearPacienteControlador);

    app.put('/pacientes/:idPaciente', {
        schema: {
            tags: ['Pacientes'],
            description: 'Actualizar un paciente',
            params: {
                type: 'object',
                properties: { idPaciente: { type: 'string', description: 'UUID del paciente' } }
            },
            body: {
                type: 'object',
                properties: {
                    tipoDocumento: { type: 'string' },
                    numeroDocumento: { type: 'string' },
                    nombres: { type: 'string' },
                    apellidos: { type: 'string' },
                    fechaNacimiento: { type: 'string' },
                    telefono: { type: 'string' },
                    correo: { type: 'string' },
                    direccion: { type: 'string' }
                }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, pacienteActualizado: { type: 'object' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, actualizarPacienteControlador);

    app.delete('/pacientes/:idPaciente', {
        schema: {
            tags: ['Pacientes'],
            description: 'Eliminar un paciente',
            params: {
                type: 'object',
                properties: { idPaciente: { type: 'string', description: 'UUID del paciente' } }
            },
            response: {
                200: { type: 'object', properties: { mensaje: { type: 'string' }, idPaciente: { type: 'string' } } },
                404: { type: 'object', properties: { mensaje: { type: 'string' } } }
            }
        }
    }, eliminarPacienteControlador);
};
