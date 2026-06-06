import { CrearConsultorio } from '../../core/aplicacion/consultorioCasoUso/CrearConsultorio.js';
import { ListarConsultorios } from '../../core/aplicacion/consultorioCasoUso/ListarConsultorios.js';
import { ObtenerConsultorioPorId } from '../../core/aplicacion/consultorioCasoUso/ObtenerConsultorioPorId.js';
import { ActualizarConsultorio } from '../../core/aplicacion/consultorioCasoUso/ActualizarConsultorio.js';
import { EliminarConsultorio } from '../../core/aplicacion/consultorioCasoUso/EliminarConsultorio.js';
import { IConsultorioRepositorio } from '../../core/dominio/repository/IConsultorioRepositorio.js';

const mockRepo: jest.Mocked<IConsultorioRepositorio> = {
    crearConsultorio: jest.fn(),
    listarConsultorios: jest.fn(),
    obtenerConsultorioPorId: jest.fn(),
    actualizarConsultorio: jest.fn(),
    eliminarConsultorio: jest.fn(),
};

describe('Consultorio Use Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('CrearConsultorio - should create and return ID', async () => {
        const caso = new CrearConsultorio(mockRepo);
        const mockId = 'c3d4e5f6-a7b8-9012-cdef-123456789012';
        mockRepo.crearConsultorio.mockResolvedValue(mockId);

        const datos = { nombre: 'Consultorio 101', ubicacion: 'Piso 1, Ala norte', disponible: true };

        const result = await caso.ejecutar(datos);

        expect(result).toBe(mockId);
        expect(mockRepo.crearConsultorio).toHaveBeenCalledWith(datos);
    });

    it('CrearConsultorio - should work with only required fields', async () => {
        const caso = new CrearConsultorio(mockRepo);
        mockRepo.crearConsultorio.mockResolvedValue('abc-123');

        const datos = { nombre: 'Consultorio 102' };

        const result = await caso.ejecutar(datos);

        expect(result).toBe('abc-123');
    });

    it('ListarConsultorios - should return list', async () => {
        const caso = new ListarConsultorios(mockRepo);
        const mockList = [
            { idConsultorio: '1', nombre: 'Consultorio 101', ubicacion: null, disponible: true },
            { idConsultorio: '2', nombre: 'Consultorio 102', ubicacion: 'Piso 2', disponible: false },
        ];
        mockRepo.listarConsultorios.mockResolvedValue(mockList);

        const result = await caso.ejecutar();

        expect(result).toEqual(mockList);
        expect(mockRepo.listarConsultorios).toHaveBeenCalledWith(undefined);
    });

    it('ListarConsultorios - should respect limit', async () => {
        const caso = new ListarConsultorios(mockRepo);
        mockRepo.listarConsultorios.mockResolvedValue([]);

        await caso.ejecutar(5);

        expect(mockRepo.listarConsultorios).toHaveBeenCalledWith(5);
    });

    it('ObtenerConsultorioPorId - should return entity when found', async () => {
        const caso = new ObtenerConsultorioPorId(mockRepo);
        const mockEntity = { idConsultorio: '1', nombre: 'Consultorio 101', ubicacion: null, disponible: true };
        mockRepo.obtenerConsultorioPorId.mockResolvedValue(mockEntity);

        const result = await caso.ejecutar('1');

        expect(result).toEqual(mockEntity);
        expect(mockRepo.obtenerConsultorioPorId).toHaveBeenCalledWith('1');
    });

    it('ObtenerConsultorioPorId - should return null when not found', async () => {
        const caso = new ObtenerConsultorioPorId(mockRepo);
        mockRepo.obtenerConsultorioPorId.mockResolvedValue(null);

        const result = await caso.ejecutar('nonexistent');

        expect(result).toBeNull();
    });

    it('ActualizarConsultorio - should update and return entity', async () => {
        const caso = new ActualizarConsultorio(mockRepo);
        const datos = { nombre: 'Consultorio 101-A', ubicacion: 'Piso 1 remodelado', disponible: false };
        mockRepo.actualizarConsultorio.mockResolvedValue({ idConsultorio: '1', ...datos });

        const result = await caso.ejecutar('1', datos);

        expect(result).toBeDefined();
        expect(result?.nombre).toBe('Consultorio 101-A');
        expect(mockRepo.actualizarConsultorio).toHaveBeenCalledWith('1', datos);
    });

    it('EliminarConsultorio - should delete entity', async () => {
        const caso = new EliminarConsultorio(mockRepo);
        mockRepo.eliminarConsultorio.mockResolvedValue(undefined);

        await caso.ejecutar('1');

        expect(mockRepo.eliminarConsultorio).toHaveBeenCalledWith('1');
    });
});
