import { CrearPaciente } from '../../core/aplicacion/pacienteCasoUso/CrearPaciente.js';
import { ListarPacientes } from '../../core/aplicacion/pacienteCasoUso/ListarPacientes.js';
import { ObtenerPacientePorId } from '../../core/aplicacion/pacienteCasoUso/ObtenerPacientePorId.js';
import { ActualizarPaciente } from '../../core/aplicacion/pacienteCasoUso/ActualizarPaciente.js';
import { EliminarPaciente } from '../../core/aplicacion/pacienteCasoUso/EliminarPaciente.js';
import { IPacienteRepositorio } from '../../core/dominio/repository/IPacienteRepositorio.js';

const mockRepo: jest.Mocked<IPacienteRepositorio> = {
    crearPaciente: jest.fn(),
    listarPacientes: jest.fn(),
    obtenerPacientePorId: jest.fn(),
    actualizarPaciente: jest.fn(),
    eliminarPaciente: jest.fn(),
};

describe('Paciente Use Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('CrearPaciente - should create a patient and return ID', async () => {
        const caso = new CrearPaciente(mockRepo);
        const mockId = '123e4567-e89b-12d3-a456-426614174000';
        mockRepo.crearPaciente.mockResolvedValue(mockId);

        const datos = {
            tipoDocumento: 'CC',
            numeroDocumento: '123456789',
            nombres: 'Juan',
            apellidos: 'Pérez',
            fechaNacimiento: new Date('1990-01-01'),
            telefono: '3001234567',
            correo: 'juan@email.com',
            direccion: 'Calle 123',
        };

        const result = await caso.ejecutar(datos);

        expect(result).toBe(mockId);
        expect(mockRepo.crearPaciente).toHaveBeenCalledWith(datos);
    });

    it('ListarPacientes - should return patient list', async () => {
        const caso = new ListarPacientes(mockRepo);
        const mockPacientes = [{
            idPaciente: '123',
            tipoDocumento: 'CC',
            numeroDocumento: '123',
            nombres: 'Juan',
            apellidos: 'Pérez',
            fechaNacimiento: new Date('1990-01-01'),
            telefono: '3001234567',
            correo: null,
            direccion: 'Calle 123',
        }];
        mockRepo.listarPacientes.mockResolvedValue(mockPacientes);

        const result = await caso.ejecutar();

        expect(result).toEqual(mockPacientes);
        expect(mockRepo.listarPacientes).toHaveBeenCalledWith(undefined);
    });

    it('ListarPacientes - should respect limit parameter', async () => {
        const caso = new ListarPacientes(mockRepo);
        mockRepo.listarPacientes.mockResolvedValue([]);

        await caso.ejecutar(5);

        expect(mockRepo.listarPacientes).toHaveBeenCalledWith(5);
    });

    it('ObtenerPacientePorId - should return patient when found', async () => {
        const caso = new ObtenerPacientePorId(mockRepo);
        const mockPaciente = {
            idPaciente: '123',
            tipoDocumento: 'CC',
            numeroDocumento: '123',
            nombres: 'Juan',
            apellidos: 'Pérez',
            fechaNacimiento: new Date('1990-01-01'),
            telefono: '3001234567',
            correo: null,
            direccion: 'Calle 123',
        };
        mockRepo.obtenerPacientePorId.mockResolvedValue(mockPaciente);

        const result = await caso.ejecutar('123');

        expect(result).toEqual(mockPaciente);
        expect(mockRepo.obtenerPacientePorId).toHaveBeenCalledWith('123');
    });

    it('ObtenerPacientePorId - should return null when patient not found', async () => {
        const caso = new ObtenerPacientePorId(mockRepo);
        mockRepo.obtenerPacientePorId.mockResolvedValue(null);

        const result = await caso.ejecutar('nonexistent');

        expect(result).toBeNull();
    });

    it('ActualizarPaciente - should update and return patient', async () => {
        const caso = new ActualizarPaciente(mockRepo);
        const datosActualizados = {
            tipoDocumento: 'CC',
            numeroDocumento: '987654321',
            nombres: 'Juan Carlos',
            apellidos: 'Pérez',
            fechaNacimiento: new Date('1990-01-01'),
            telefono: '3001234567',
            correo: null,
            direccion: 'Calle 456',
        };
        mockRepo.actualizarPaciente.mockResolvedValue({ idPaciente: '123', ...datosActualizados });

        const result = await caso.ejecutar('123', datosActualizados);

        expect(result).toBeDefined();
        expect(result?.nombres).toBe('Juan Carlos');
        expect(mockRepo.actualizarPaciente).toHaveBeenCalledWith('123', datosActualizados);
    });

    it('EliminarPaciente - should delete patient', async () => {
        const caso = new EliminarPaciente(mockRepo);
        mockRepo.eliminarPaciente.mockResolvedValue(undefined);

        await caso.ejecutar('123');

        expect(mockRepo.eliminarPaciente).toHaveBeenCalledWith('123');
    });
});
