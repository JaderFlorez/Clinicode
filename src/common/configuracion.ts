import dotenv from 'dotenv';

dotenv.config();

export const configuracion = {
    dbHost: process.env.DB_HOST ?? 'localhost',
    dbUser: process.env.DB_USER ?? 'postgres',
    dbPassword: process.env.DB_PASSWORD ?? '',
    dbDatabase: process.env.DB_DATABASE ?? 'pacientes',
    dbPort: Number(process.env.DB_PORT) || 5432,
};
