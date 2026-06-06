import { CrearCitaMedica } from '../../core/aplicacion/citaMedicaCasoUso/CrearCitaMedica.js';
import { ListarCitasMedicas } from '../../core/aplicacion/citaMedicaCasoUso/ListarCitasMedicas.js';
import { ObtenerCitaMedicaPorId } from '../../core/aplicacion/citaMedicaCasoUso/ObtenerCitaMedicaPorId.js';
import { ActualizarCitaMedica } from '../../core/aplicacion/citaMedicaCasoUso/ActualizarCitaMedica.js';
import { EliminarCitaMedica } from '../../core/aplicacion/citaMedicaCasoUso/EliminarCitaMedica.js';
import { ICitaMedicaRepositorio } from '../../core/dominio/repository/ICitaMedicaRepositorio.js';

const mockRepo: jest.Mocked<ICitaMedicaRepositorio> = {
    crearCita: jest.fn(),
    listarCitas: jest.fn(),
    obtenerCitaPorId: jest.fn(),
    actualizarCita: jest.fn(),
    eliminarCita: jest.fn(),
};

describe('CitaMedica Use Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('CrearCitaMedica - should create and return ID', async () => {
        const caso = new CrearCitaMedica(mockRepo);
        const mockId = 'e5f6a7b8-c9d0-1234-efab-345678901234';
        mockRepo.crearCita.mockResolvedValue(mockId);

        const datos = {
            idPaciente: '123e4567-e89b-12d3-a456-426614174000',
            idMedico: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            idConsultorio: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            fechaCita: new Date('2025-06-10T10:00:00'),
            motivo: 'Control general',
            estado: 'Programada',
        };

        const result = await caso.ejecutar(datos);

        expect(result).toBe(mockId);
        expect(mockRepo.crearCita).toHaveBeenCalledWith(datos);
    });

    it('CrearCitaMedica - should work without optional fields', async () => {
        const caso = new CrearCitaMedica(mockRepo);
        mockRepo.crearCita.mockResolvedValue('abc-123');

        const datos = {
            idPaciente: '123e4567-e89b-12d3-a456-426614174000',
            idMedico: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            idConsultorio: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            fechaCita: new Date('2025-06-11T14:30:00'),
        };

        const result = await caso.ejecutar(datos);

        expect(result).toBe('abc-123');
    });

    it('ListarCitasMedicas - should return list', async () => {
        const caso = new ListarCitasMedicas(mockRepo);
        const mockList = [{
            idCita: '1',
            idPaciente: 'p1',
            idMedico: 'm1',
            idConsultorio: 'c1',
            fechaCita: new Date('2025-06-10T10:00:00'),
            motivo: 'Control',
            estado: 'Programada',
        }];
        mockRepo.listarCitas.mockResolvedValue(mockList);

        const result = await caso.ejecutar();

        expect(result).toEqual(mockList);
        expect(mockRepo.listarCitas).toHaveBeenCalledWith(undefined);
    });

    it('ListarCitasMedicas - should respect limit', async () => {
        const caso = new ListarCitasMedicas(mockRepo);
        mockRepo.listarCitas.mockResolvedValue([]);

        await caso.ejecutar(5);

        expect(mockRepo.listarCitas).toHaveBeenCalledWith(5);
    });

    it('ObtenerCitaMedicaPorId - should return entity when found', async () => {
        const caso = new ObtenerCitaMedicaPorId(mockRepo);
        const mockEntity = {
            idCita: '1',
            idPaciente: 'p1',
            idMedico: 'm1',
            idConsultorio: 'c1',
            fechaCita: new Date('2025-06-10T10:00:00'),
            motivo: null,
            estado: 'Programada',
        };
        mockRepo.obtenerCitaPorId.mockResolvedValue(mockEntity);

        const result = await caso.ejecutar('1');

        expect(result).toEqual(mockEntity);
        expect(mockRepo.obtenerCitaPorId).toHaveBeenCalledWith('1');
    });

    it('ObtenerCitaMedicaPorId - should return null when not found', async () => {
        const caso = new ObtenerCitaMedicaPorId(mockRepo);
        mockRepo.obtenerCitaPorId.mockResolvedValue(null);

        const result = await caso.ejecutar('nonexistent');

        expect(result).toBeNull();
    });

    it('ActualizarCitaMedica - should update and return entity', async () => {
        const caso = new ActualizarCitaMedica(mockRepo);
        const datos = {
            idPaciente: 'p1',
            idMedico: 'm2',
            idConsultorio: 'c2',
            fechaCita: new Date('2025-06-15T11:00:00'),
            motivo: 'Reprogramación',
            estado: 'Reprogramada',
        };
        mockRepo.actualizarCita.mockResolvedValue({ idCita: '1', ...datos });

        const result = await caso.ejecutar('1', datos);

        expect(result).toBeDefined();
        expect(result?.estado).toBe('Reprogramada');
        expect(mockRepo.actualizarCita).toHaveBeenCalledWith('1', datos);
    });

    it('EliminarCitaMedica - should delete entity', async () => {
        const caso = new EliminarCitaMedica(mockRepo);
        mockRepo.eliminarCita.mockResolvedValue(undefined);

        await caso.ejecutar('1');

        expect(mockRepo.eliminarCita).toHaveBeenCalledWith('1');
    });
});
