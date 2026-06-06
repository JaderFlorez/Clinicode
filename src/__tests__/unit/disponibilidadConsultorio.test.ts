import { CrearDisponibilidadConsultorio } from '../../core/aplicacion/disponibilidadConsultorioCasoUso/CrearDisponibilidadConsultorio.js';
import { ListarDisponibilidadesConsultorio } from '../../core/aplicacion/disponibilidadConsultorioCasoUso/ListarDisponibilidadesConsultorio.js';
import { ObtenerDisponibilidadConsultorioPorId } from '../../core/aplicacion/disponibilidadConsultorioCasoUso/ObtenerDisponibilidadConsultorioPorId.js';
import { ActualizarDisponibilidadConsultorio } from '../../core/aplicacion/disponibilidadConsultorioCasoUso/ActualizarDisponibilidadConsultorio.js';
import { EliminarDisponibilidadConsultorio } from '../../core/aplicacion/disponibilidadConsultorioCasoUso/EliminarDisponibilidadConsultorio.js';
import { IDisponibilidadConsultorioRepositorio } from '../../core/dominio/repository/IDisponibilidadConsultorioRepositorio.js';

const mockRepo: jest.Mocked<IDisponibilidadConsultorioRepositorio> = {
    crearDisponibilidad: jest.fn(),
    listarDisponibilidades: jest.fn(),
    obtenerDisponibilidadPorId: jest.fn(),
    actualizarDisponibilidad: jest.fn(),
    eliminarDisponibilidad: jest.fn(),
};

describe('DisponibilidadConsultorio Use Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('CrearDisponibilidadConsultorio - should create and return ID', async () => {
        const caso = new CrearDisponibilidadConsultorio(mockRepo);
        const mockId = 'd4e5f6a7-b8c9-0123-defa-234567890123';
        mockRepo.crearDisponibilidad.mockResolvedValue(mockId);

        const datos = {
            idConsultorio: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            diaSemana: 'Lunes',
            horaInicio: '08:00',
            horaFin: '12:00',
            disponible: true,
        };

        const result = await caso.ejecutar(datos);

        expect(result).toBe(mockId);
        expect(mockRepo.crearDisponibilidad).toHaveBeenCalledWith(datos);
    });

    it('CrearDisponibilidadConsultorio - should work without disponible field', async () => {
        const caso = new CrearDisponibilidadConsultorio(mockRepo);
        mockRepo.crearDisponibilidad.mockResolvedValue('abc-123');

        const datos = {
            idConsultorio: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            diaSemana: 'Martes',
            horaInicio: '14:00',
            horaFin: '18:00',
        };

        const result = await caso.ejecutar(datos);

        expect(result).toBe('abc-123');
    });

    it('ListarDisponibilidadesConsultorio - should return list', async () => {
        const caso = new ListarDisponibilidadesConsultorio(mockRepo);
        const mockList = [{
            idDisponibilidad: '1',
            idConsultorio: 'c1',
            diaSemana: 'Lunes',
            horaInicio: '08:00',
            horaFin: '12:00',
            disponible: true,
        }];
        mockRepo.listarDisponibilidades.mockResolvedValue(mockList);

        const result = await caso.ejecutar();

        expect(result).toEqual(mockList);
        expect(mockRepo.listarDisponibilidades).toHaveBeenCalledWith(undefined);
    });

    it('ListarDisponibilidadesConsultorio - should respect limit', async () => {
        const caso = new ListarDisponibilidadesConsultorio(mockRepo);
        mockRepo.listarDisponibilidades.mockResolvedValue([]);

        await caso.ejecutar(10);

        expect(mockRepo.listarDisponibilidades).toHaveBeenCalledWith(10);
    });

    it('ObtenerDisponibilidadConsultorioPorId - should return entity when found', async () => {
        const caso = new ObtenerDisponibilidadConsultorioPorId(mockRepo);
        const mockEntity = {
            idDisponibilidad: '1',
            idConsultorio: 'c1',
            diaSemana: 'Miércoles',
            horaInicio: '09:00',
            horaFin: '13:00',
            disponible: false,
        };
        mockRepo.obtenerDisponibilidadPorId.mockResolvedValue(mockEntity);

        const result = await caso.ejecutar('1');

        expect(result).toEqual(mockEntity);
        expect(mockRepo.obtenerDisponibilidadPorId).toHaveBeenCalledWith('1');
    });

    it('ObtenerDisponibilidadConsultorioPorId - should return null when not found', async () => {
        const caso = new ObtenerDisponibilidadConsultorioPorId(mockRepo);
        mockRepo.obtenerDisponibilidadPorId.mockResolvedValue(null);

        const result = await caso.ejecutar('nonexistent');

        expect(result).toBeNull();
    });

    it('ActualizarDisponibilidadConsultorio - should update and return entity', async () => {
        const caso = new ActualizarDisponibilidadConsultorio(mockRepo);
        const datos = {
            idConsultorio: 'c1',
            diaSemana: 'Viernes',
            horaInicio: '10:00',
            horaFin: '16:00',
            disponible: true,
        };
        mockRepo.actualizarDisponibilidad.mockResolvedValue({ idDisponibilidad: '1', ...datos });

        const result = await caso.ejecutar('1', datos);

        expect(result).toBeDefined();
        expect(result?.diaSemana).toBe('Viernes');
        expect(mockRepo.actualizarDisponibilidad).toHaveBeenCalledWith('1', datos);
    });

    it('EliminarDisponibilidadConsultorio - should delete entity', async () => {
        const caso = new EliminarDisponibilidadConsultorio(mockRepo);
        mockRepo.eliminarDisponibilidad.mockResolvedValue(undefined);

        await caso.ejecutar('1');

        expect(mockRepo.eliminarDisponibilidad).toHaveBeenCalledWith('1');
    });
});
