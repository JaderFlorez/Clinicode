import { CrearAgendaMedico } from '../../core/aplicacion/agendaMedicoCasoUso/CrearAgenda.js';
import { ListarAgendaMedico } from '../../core/aplicacion/agendaMedicoCasoUso/ListarAgendaMedico.js';
import { ObtenerAgendaPorId } from '../../core/aplicacion/agendaMedicoCasoUso/ObtenerAgendaMedicoPorId.js';
import { ActualizarAgenda } from '../../core/aplicacion/agendaMedicoCasoUso/ActualizarAgenda.js';
import { EliminarAgenda } from '../../core/aplicacion/agendaMedicoCasoUso/EliminarAgenda.js';
import { IAgendaMedicoRepositorio } from '../../core/dominio/repository/IAgendaMedicoRepositorio.js';

const mockRepo: jest.Mocked<IAgendaMedicoRepositorio> = {
    crearAgenda: jest.fn(),
    listarAgendas: jest.fn(),
    obtenerAgendaPorId: jest.fn(),
    actualizarAgenda: jest.fn(),
    eliminarAgenda: jest.fn(),
};

describe('AgendaMedico Use Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('CrearAgendaMedico - should create and return ID', async () => {
        const caso = new CrearAgendaMedico(mockRepo);
        const mockId = 'f6a7b8c9-d0e1-2345-fabc-456789012345';
        mockRepo.crearAgenda.mockResolvedValue(mockId);

        const datos = {
            idMedico: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            idConsultorio: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            diasDisponibles: ['Lunes', 'Miércoles', 'Viernes'],
            horaInicio: '08:00',
            horaFin: '12:00',
        };

        const result = await caso.ejecutar(datos);

        expect(result).toBe(mockId);
        expect(mockRepo.crearAgenda).toHaveBeenCalledWith(datos);
    });

    it('ListarAgendaMedico - should return list', async () => {
        const caso = new ListarAgendaMedico(mockRepo);
        const mockList = [{
            idAgenda: '1',
            idMedico: 'm1',
            idConsultorio: 'c1',
            diasDisponibles: ['Lunes', 'Martes'],
            horaInicio: '08:00',
            horaFin: '12:00',
        }];
        mockRepo.listarAgendas.mockResolvedValue(mockList);

        const result = await caso.ejecutar();

        expect(result).toEqual(mockList);
        expect(mockRepo.listarAgendas).toHaveBeenCalledWith(undefined);
    });

    it('ListarAgendaMedico - should respect limit', async () => {
        const caso = new ListarAgendaMedico(mockRepo);
        mockRepo.listarAgendas.mockResolvedValue([]);

        await caso.ejecutar(5);

        expect(mockRepo.listarAgendas).toHaveBeenCalledWith(5);
    });

    it('ObtenerAgendaPorId - should return entity when found', async () => {
        const caso = new ObtenerAgendaPorId(mockRepo);
        const mockEntity = {
            idAgenda: '1',
            idMedico: 'm1',
            idConsultorio: 'c1',
            diasDisponibles: ['Lunes', 'Martes', 'Miércoles'],
            horaInicio: '14:00',
            horaFin: '18:00',
        };
        mockRepo.obtenerAgendaPorId.mockResolvedValue(mockEntity);

        const result = await caso.ejecutar('1');

        expect(result).toEqual(mockEntity);
        expect(mockRepo.obtenerAgendaPorId).toHaveBeenCalledWith('1');
    });

    it('ObtenerAgendaPorId - should return null when not found', async () => {
        const caso = new ObtenerAgendaPorId(mockRepo);
        mockRepo.obtenerAgendaPorId.mockResolvedValue(null);

        const result = await caso.ejecutar('nonexistent');

        expect(result).toBeNull();
    });

    it('ActualizarAgenda - should update and return entity', async () => {
        const caso = new ActualizarAgenda(mockRepo);
        const datos = {
            idMedico: 'm1',
            idConsultorio: 'c2',
            diasDisponibles: ['Martes', 'Jueves'],
            horaInicio: '09:00',
            horaFin: '13:00',
        };
        mockRepo.actualizarAgenda.mockResolvedValue({ idAgenda: '1', ...datos });

        const result = await caso.ejecutar('1', datos);

        expect(result).toBeDefined();
        expect(result?.diasDisponibles).toEqual(['Martes', 'Jueves']);
        expect(mockRepo.actualizarAgenda).toHaveBeenCalledWith('1', datos);
    });

    it('EliminarAgenda - should delete entity', async () => {
        const caso = new EliminarAgenda(mockRepo);
        mockRepo.eliminarAgenda.mockResolvedValue(undefined);

        await caso.ejecutar('1');

        expect(mockRepo.eliminarAgenda).toHaveBeenCalledWith('1');
    });
});
