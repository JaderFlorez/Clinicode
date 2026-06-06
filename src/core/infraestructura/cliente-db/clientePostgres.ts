import pg from 'pg';
import { configuracion } from '../../../common/configuracion.js';

const { Pool } = pg;

const pool = new Pool({
    host: configuracion.dbHost,
    user: configuracion.dbUser,
    password: configuracion.dbPassword,
    database: configuracion.dbDatabase,
    port: configuracion.dbPort,
});

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL:', err);
});

export const db = {
    query: (text: string, params?: unknown[]) => pool.query(text, params),
    getClient: () => pool.connect(),
};

export default pool;
