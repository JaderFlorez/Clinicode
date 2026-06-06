import { CrearEspecialidad } from '../../core/aplicacion/especialidadCasoUso/CrearEspecialidad.js';
import { ListarEspecialidades } from '../../core/aplicacion/especialidadCasoUso/ListarEspecialidades.js';
import { ObtenerEspecialidadPorId } from '../../core/aplicacion/especialidadCasoUso/ObtenerEspecialidadPorId.js';
import { ActualizarEspecialidad } from '../../core/aplicacion/especialidadCasoUso/ActualizarEspecialidad.js';
import { EliminarEspecialidad } from '../../core/aplicacion/especialidadCasoUso/EliminarEspecialidad.js';
import { IEspecialidadRepositorio } from '../../core/dominio/repository/IEspecialidadRepositorio.js';

const mockRepo: jest.Mocked<IEspecialidadRepositorio> = {
    crearEspecialidad: jest.fn(),
    listarEspecialidades: jest.fn(),
    obtenerEspecialidadPorId: jest.fn(),
    actualizarEspecialidad: jest.fn(),
    eliminarEspecialidad: jest.fn(),
};

describe('Especialidad Use Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('CrearEspecialidad - should create and return ID', async () => {
        const caso = new CrearEspecialidad(mockRepo);
        const mockId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
        mockRepo.crearEspecialidad.mockResolvedValue(mockId);

        const datos = { nombre: 'Cardiología', descripcion: 'Especialidad del corazón' };
        const result = await caso.ejecutar(datos);

        expect(result).toBe(mockId);
        expect(mockRepo.crearEspecialidad).toHaveBeenCalledWith(datos);
    });

    it('CrearEspecialidad - should work without description', async () => {
        const caso = new CrearEspecialidad(mockRepo);
        mockRepo.crearEspecialidad.mockResolvedValue('abc-123');

        const datos = { nombre: 'Pediatría' };
        const result = await caso.ejecutar(datos);

        expect(result).toBe('abc-123');
    });

    it('ListarEspecialidades - should return list', async () => {
        const caso = new ListarEspecialidades(mockRepo);
        const mockList = [
            { idEspecialidad: '1', nombre: 'Cardiología', descripcion: null },
            { idEspecialidad: '2', nombre: 'Pediatría', descripcion: 'Atención infantil' },
        ];
        mockRepo.listarEspecialidades.mockResolvedValue(mockList);

        const result = await caso.ejecutar();

        expect(result).toEqual(mockList);
        expect(mockRepo.listarEspecialidades).toHaveBeenCalledWith(undefined);
    });

    it('ListarEspecialidades - should respect limit', async () => {
        const caso = new ListarEspecialidades(mockRepo);
        mockRepo.listarEspecialidades.mockResolvedValue([]);

        await caso.ejecutar(10);

        expect(mockRepo.listarEspecialidades).toHaveBeenCalledWith(10);
    });

    it('ObtenerEspecialidadPorId - should return entity when found', async () => {
        const caso = new ObtenerEspecialidadPorId(mockRepo);
        const mockEntity = { idEspecialidad: '1', nombre: 'Cardiología', descripcion: null };
        mockRepo.obtenerEspecialidadPorId.mockResolvedValue(mockEntity);

        const result = await caso.ejecutar('1');

        expect(result).toEqual(mockEntity);
        expect(mockRepo.obtenerEspecialidadPorId).toHaveBeenCalledWith('1');
    });

    it('ObtenerEspecialidadPorId - should return null when not found', async () => {
        const caso = new ObtenerEspecialidadPorId(mockRepo);
        mockRepo.obtenerEspecialidadPorId.mockResolvedValue(null);

        const result = await caso.ejecutar('nonexistent');

        expect(result).toBeNull();
    });

    it('ActualizarEspecialidad - should update and return entity', async () => {
        const caso = new ActualizarEspecialidad(mockRepo);
        const datos = { nombre: 'Cardiología Avanzada', descripcion: 'Subespecialidad' };
        mockRepo.actualizarEspecialidad.mockResolvedValue({ idEspecialidad: '1', ...datos });

        const result = await caso.ejecutar('1', datos);

        expect(result).toBeDefined();
        expect(result?.nombre).toBe('Cardiología Avanzada');
        expect(mockRepo.actualizarEspecialidad).toHaveBeenCalledWith('1', datos);
    });

    it('EliminarEspecialidad - should delete entity', async () => {
        const caso = new EliminarEspecialidad(mockRepo);
        mockRepo.eliminarEspecialidad.mockResolvedValue(undefined);

        await caso.ejecutar('1');

        expect(mockRepo.eliminarEspecialidad).toHaveBeenCalledWith('1');
    });
});
