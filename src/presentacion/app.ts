import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { pacienteEnrutador } from './rutas/pacienteEnrutador.js';
import { agendaMedicoEnrutador } from './rutas/agendaMedicoEnrutador.js';
import { especialidadEnrutador } from './rutas/especialidadEnrutador.js';
import { medicoEnrutador } from './rutas/medicoEnrutador.js';
import { consultorioEnrutador } from './rutas/consultorioEnrutador.js';
import { disponibilidadConsultorioEnrutador } from './rutas/disponibilidadConsultorioEnrutador.js';
import { citaMedicaEnrutador } from './rutas/citaMedicaEnrutador.js';

const app = Fastify({ logger: true });

app.register(cors);

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Clinicode API',
            description: 'API para gestión de clínica médica - Pacientes, Médicos, Consultorios, Especialidades, Citas Médicas y Agendas',
            version: '1.0.0',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Servidor local de desarrollo' },
        ],
        tags: [
            { name: 'Pacientes', description: 'CRUD de pacientes' },
            { name: 'Médicos', description: 'CRUD de médicos' },
            { name: 'Especialidades', description: 'CRUD de especialidades médicas' },
            { name: 'Consultorios', description: 'CRUD de consultorios' },
            { name: 'Agendas Médico', description: 'CRUD de agendas de médicos' },
            { name: 'Disponibilidad Consultorios', description: 'CRUD de disponibilidad de consultorios' },
            { name: 'Citas Médicas', description: 'CRUD de citas médicas' },
        ],
    },
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
    },
});

app.register(pacienteEnrutador, { prefix: '/api' });
app.register(agendaMedicoEnrutador, { prefix: '/api' });
app.register(especialidadEnrutador, { prefix: '/api' });
app.register(medicoEnrutador, { prefix: '/api' });
app.register(consultorioEnrutador, { prefix: '/api' });
app.register(disponibilidadConsultorioEnrutador, { prefix: '/api' });
app.register(citaMedicaEnrutador, { prefix: '/api' });

app.get('/', async () => {
    return {
        mensaje: 'Clinicode API funcionando',
        documentacion: 'http://localhost:3000/docs',
    };
});

export default app;
