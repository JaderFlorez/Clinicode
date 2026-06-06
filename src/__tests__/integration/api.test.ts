import app from '../../presentacion/app.js';

describe('API Integration Tests', () => {
    afterAll(async () => {
        await app.close();
    });

    it('GET / should return server status', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body.mensaje).toContain('funcionando');
    });

    it('GET /api/pacientes should return patients list', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/pacientes',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('mensaje');
    });

    it('GET /docs should return swagger UI', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/docs',
        });

        expect(response.statusCode).toBe(200);
        expect(response.payload).toContain('swagger');
    });

    it('POST /api/pacientes without body should return 400', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/pacientes',
            payload: {},
        });

        expect(response.statusCode).toBe(400);
    });
});
