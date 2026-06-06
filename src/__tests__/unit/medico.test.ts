import { CrearMedico } from '../../core/aplicacion/medicoCasoUso/CrearMedico.js';
import { ListarMedicos } from '../../core/aplicacion/medicoCasoUso/ListarMedicos.js';
import { ObtenerMedicoPorId } from '../../core/aplicacion/medicoCasoUso/ObtenerMedicoPorId.js';
import { ActualizarMedico } from '../../core/aplicacion/medicoCasoUso/ActualizarMedico.js';
import { EliminarMedico } from '../../core/aplicacion/medicoCasoUso/EliminarMedico.js';
import { IMedicoRepositorio } from '../../core/dominio/repository/IMedicoRepositorio.js';

const mockRepo: jest.Mocked<IMedicoRepositorio> = {
    crearMedico: jest.fn(),
    listarMedicos: jest.fn(),
    obtenerMedicoPorId: jest.fn(),
    actualizarMedico: jest.fn(),
    eliminarMedico: jest.fn(),
};

describe('Medico Use Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('CrearMedico - should create and return ID', async () => {
        const caso = new CrearMedico(mockRepo);
        const mockId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
        mockRepo.crearMedico.mockResolvedValue(mockId);

        const datos = {
            nombres: 'María',
            apellidos: 'González',
            numeroLicencia: 'LIC-12345',
            idEspecialidad: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            telefono: '3109876543',
            correo: 'maria@hospital.com',
        };

        const result = await caso.ejecutar(datos);

        expect(result).toBe(mockId);
        expect(mockRepo.crearMedico).toHaveBeenCalledWith(datos);
    });

    it('CrearMedico - should work without optional fields', async () => {
        const caso = new CrearMedico(mockRepo);
        mockRepo.crearMedico.mockResolvedValue('abc-123');

        const datos = {
            nombres: 'Carlos',
            apellidos: 'López',
            numeroLicencia: 'LIC-67890',
            idEspecialidad: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        };

        const result = await caso.ejecutar(datos);

        expect(result).toBe('abc-123');
    });

    it('ListarMedicos - should return list', async () => {
        const caso = new ListarMedicos(mockRepo);
        const mockList = [{
            idMedico: '1',
            nombres: 'María',
            apellidos: 'González',
            numeroLicencia: 'LIC-12345',
            idEspecialidad: 'esp-1',
            telefono: null,
            correo: null,
        }];
        mockRepo.listarMedicos.mockResolvedValue(mockList);

        const result = await caso.ejecutar();

        expect(result).toEqual(mockList);
        expect(mockRepo.listarMedicos).toHaveBeenCalledWith(undefined);
    });

    it('ListarMedicos - should respect limit', async () => {
        const caso = new ListarMedicos(mockRepo);
        mockRepo.listarMedicos.mockResolvedValue([]);

        await caso.ejecutar(5);

        expect(mockRepo.listarMedicos).toHaveBeenCalledWith(5);
    });

    it('ObtenerMedicoPorId - should return entity when found', async () => {
        const caso = new ObtenerMedicoPorId(mockRepo);
        const mockEntity = {
            idMedico: '1',
            nombres: 'María',
            apellidos: 'González',
            numeroLicencia: 'LIC-12345',
            idEspecialidad: 'esp-1',
            telefono: null,
            correo: null,
        };
        mockRepo.obtenerMedicoPorId.mockResolvedValue(mockEntity);

        const result = await caso.ejecutar('1');

        expect(result).toEqual(mockEntity);
        expect(mockRepo.obtenerMedicoPorId).toHaveBeenCalledWith('1');
    });

    it('ObtenerMedicoPorId - should return null when not found', async () => {
        const caso = new ObtenerMedicoPorId(mockRepo);
        mockRepo.obtenerMedicoPorId.mockResolvedValue(null);

        const result = await caso.ejecutar('nonexistent');

        expect(result).toBeNull();
    });

    it('ActualizarMedico - should update and return entity', async () => {
        const caso = new ActualizarMedico(mockRepo);
        const datos = {
            nombres: 'María José',
            apellidos: 'González Ruiz',
            numeroLicencia: 'LIC-99999',
            idEspecialidad: 'esp-2',
            telefono: null,
            correo: null,
        };
        mockRepo.actualizarMedico.mockResolvedValue({ idMedico: '1', ...datos });

        const result = await caso.ejecutar('1', datos);

        expect(result).toBeDefined();
        expect(result?.nombres).toBe('María José');
        expect(mockRepo.actualizarMedico).toHaveBeenCalledWith('1', datos);
    });

    it('EliminarMedico - should delete entity', async () => {
        const caso = new EliminarMedico(mockRepo);
        mockRepo.eliminarMedico.mockResolvedValue(undefined);

        await caso.ejecutar('1');

        expect(mockRepo.eliminarMedico).toHaveBeenCalledWith('1');
    });
});
