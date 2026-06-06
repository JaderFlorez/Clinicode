import { CrearPacienteEsquema } from '../../core/infraestructura/esquemas/PacienteEsquema.js';
import { CrearEspecialidadEsquema } from '../../core/infraestructura/esquemas/EspecialidadEsquema.js';
import { CrearMedicoEsquema } from '../../core/infraestructura/esquemas/MedicoEsquema.js';
import { CrearConsultorioEsquema } from '../../core/infraestructura/esquemas/ConsultorioEsquema.js';
import { CrearDisponibilidadConsultorioEsquema } from '../../core/infraestructura/esquemas/DisponibilidadConsultorioEsquema.js';
import { CrearCitaMedicaEsquema } from '../../core/infraestructura/esquemas/CitaMedicaEsquema.js';
import { CrearAgendaMedicoEsquema } from '../../core/infraestructura/esquemas/AgendaMedicoEsquema.js';

describe('PacienteEsquema', () => {
    it('should validate correct data', () => {
        const data = {
            tipoDocumento: 'CC',
            numeroDocumento: '123456789',
            nombres: 'Juan',
            apellidos: 'Pérez',
            fechaNacimiento: '1990-01-01',
            telefono: '3001234567',
            direccion: 'Calle 123',
        };
        const result = CrearPacienteEsquema.parse(data);
        expect(result.tipoDocumento).toBe('CC');
        expect(result.fechaNacimiento).toBeInstanceOf(Date);
    });

    it('should reject empty required fields', () => {
        expect(() => CrearPacienteEsquema.parse({})).toThrow();
    });

    it('should handle optional correo', () => {
        const data = {
            tipoDocumento: 'CC',
            numeroDocumento: '123456789',
            nombres: 'Juan',
            apellidos: 'Pérez',
            fechaNacimiento: '1990-01-01',
            telefono: '3001234567',
            direccion: 'Calle 123',
        };
        const result = CrearPacienteEsquema.parse(data);
        expect(result.correo).toBeNull();
    });

    it('should accept correo when provided', () => {
        const data = {
            tipoDocumento: 'CC',
            numeroDocumento: '123456789',
            nombres: 'Juan',
            apellidos: 'Pérez',
            fechaNacimiento: '1990-01-01',
            telefono: '3001234567',
            correo: 'juan@email.com',
            direccion: 'Calle 123',
        };
        const result = CrearPacienteEsquema.parse(data);
        expect(result.correo).toBe('juan@email.com');
    });

    it('should reject future date of birth', () => {
        const data = {
            tipoDocumento: 'CC',
            numeroDocumento: '123456789',
            nombres: 'Juan',
            apellidos: 'Pérez',
            fechaNacimiento: '2099-01-01',
            telefono: '3001234567',
            direccion: 'Calle 123',
        };
        expect(() => CrearPacienteEsquema.parse(data)).toThrow();
    });
});

describe('EspecialidadEsquema', () => {
    it('should validate correct data', () => {
        const result = CrearEspecialidadEsquema.parse({ nombre: 'Cardiología' });
        expect(result.nombre).toBe('Cardiología');
    });

    it('should accept description as optional', () => {
        const result = CrearEspecialidadEsquema.parse({ nombre: 'Pediatría', descripcion: 'Atención infantil' });
        expect(result.descripcion).toBe('Atención infantil');
    });

    it('should transform missing description to null', () => {
        const result = CrearEspecialidadEsquema.parse({ nombre: 'Cardiología' });
        expect(result.descripcion).toBeNull();
    });

    it('should reject empty name', () => {
        expect(() => CrearEspecialidadEsquema.parse({})).toThrow();
    });
});

describe('MedicoEsquema', () => {
    const validMedico = {
        nombres: 'María',
        apellidos: 'González',
        numeroLicencia: 'LIC-12345',
        idEspecialidad: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    };

    it('should validate correct data', () => {
        const result = CrearMedicoEsquema.parse(validMedico);
        expect(result.nombres).toBe('María');
        expect(result.apellidos).toBe('González');
    });

    it('should transform missing optional fields to null', () => {
        const result = CrearMedicoEsquema.parse(validMedico);
        expect(result.telefono).toBeNull();
        expect(result.correo).toBeNull();
    });

    it('should accept telefono and correo when provided', () => {
        const data = { ...validMedico, telefono: '3101234567', correo: 'maria@hospital.com' };
        const result = CrearMedicoEsquema.parse(data);
        expect(result.telefono).toBe('3101234567');
        expect(result.correo).toBe('maria@hospital.com');
    });

    it('should reject empty required fields', () => {
        expect(() => CrearMedicoEsquema.parse({})).toThrow();
    });

    it('should reject invalid UUID for idEspecialidad', () => {
        const data = { ...validMedico, idEspecialidad: 'not-a-uuid' };
        expect(() => CrearMedicoEsquema.parse(data)).toThrow();
    });
});

describe('ConsultorioEsquema', () => {
    it('should validate correct data', () => {
        const data = { nombre: 'Consultorio 101', ubicacion: 'Piso 1', disponible: true };
        const result = CrearConsultorioEsquema.parse(data);
        expect(result.nombre).toBe('Consultorio 101');
        expect(result.ubicacion).toBe('Piso 1');
        expect(result.disponible).toBe(true);
    });

    it('should transform missing ubicacion to null', () => {
        const result = CrearConsultorioEsquema.parse({ nombre: 'Consultorio 102' });
        expect(result.ubicacion).toBeNull();
    });

    it('should default disponible to undefined when not provided', () => {
        const result = CrearConsultorioEsquema.parse({ nombre: 'Consultorio 102' });
        expect(result.disponible).toBeUndefined();
    });

    it('should reject empty name', () => {
        expect(() => CrearConsultorioEsquema.parse({})).toThrow();
    });
});

describe('DisponibilidadConsultorioEsquema', () => {
    const validData = {
        idConsultorio: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        diaSemana: 'Lunes',
        horaInicio: '08:00',
        horaFin: '12:00',
    };

    it('should validate correct data', () => {
        const result = CrearDisponibilidadConsultorioEsquema.parse(validData);
        expect(result.diaSemana).toBe('Lunes');
        expect(result.horaInicio).toBe('08:00');
    });

    it('should reject invalid day of week', () => {
        const data = { ...validData, diaSemana: 'InvalidDay' };
        expect(() => CrearDisponibilidadConsultorioEsquema.parse(data)).toThrow();
    });

    it('should reject horaFin before horaInicio', () => {
        const data = { ...validData, horaInicio: '14:00', horaFin: '08:00' };
        expect(() => CrearDisponibilidadConsultorioEsquema.parse(data)).toThrow();
    });

    it('should reject invalid time format', () => {
        const data = { ...validData, horaInicio: '25:00' };
        expect(() => CrearDisponibilidadConsultorioEsquema.parse(data)).toThrow();
    });

    it('should reject empty required fields', () => {
        expect(() => CrearDisponibilidadConsultorioEsquema.parse({})).toThrow();
    });
});

describe('CitaMedicaEsquema', () => {
    const validData = {
        idPaciente: '123e4567-e89b-12d3-a456-426614174000',
        idMedico: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        idConsultorio: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        fechaCita: '2025-06-10T10:00:00',
    };

    it('should validate correct data', () => {
        const result = CrearCitaMedicaEsquema.parse(validData);
        expect(result.fechaCita).toBeInstanceOf(Date);
        expect(result.estado).toBe('Programada');
    });

    it('should transform missing motivo to null', () => {
        const result = CrearCitaMedicaEsquema.parse(validData);
        expect(result.motivo).toBeNull();
    });

    it('should accept motivo when provided', () => {
        const data = { ...validData, motivo: 'Control general' };
        const result = CrearCitaMedicaEsquema.parse(data);
        expect(result.motivo).toBe('Control general');
    });

    it('should accept custom estado', () => {
        const data = { ...validData, estado: 'Cancelada' };
        const result = CrearCitaMedicaEsquema.parse(data);
        expect(result.estado).toBe('Cancelada');
    });

    it('should reject invalid UUIDs', () => {
        const data = { ...validData, idPaciente: 'not-a-uuid' };
        expect(() => CrearCitaMedicaEsquema.parse(data)).toThrow();
    });

    it('should reject invalid fechaCita format', () => {
        const data = { ...validData, fechaCita: 'invalid-date' };
        expect(() => CrearCitaMedicaEsquema.parse(data)).toThrow();
    });
});

describe('AgendaMedicoEsquema', () => {
    const validData = {
        idMedico: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        idConsultorio: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        diasDisponibles: ['Lunes', 'Miércoles', 'Viernes'],
        horaInicio: '08:00',
        horaFin: '12:00',
    };

    it('should validate correct data', () => {
        const result = CrearAgendaMedicoEsquema.parse(validData);
        expect(result.diasDisponibles).toEqual(['Lunes', 'Miércoles', 'Viernes']);
        expect(result.horaInicio).toBe('08:00');
    });

    it('should reject empty diasDisponibles', () => {
        const data = { ...validData, diasDisponibles: [] };
        expect(() => CrearAgendaMedicoEsquema.parse(data)).toThrow();
    });

    it('should reject invalid day in diasDisponibles', () => {
        const data = { ...validData, diasDisponibles: ['Lunes', 'InvalidDay'] };
        expect(() => CrearAgendaMedicoEsquema.parse(data)).toThrow();
    });

    it('should reject horaFin before horaInicio', () => {
        const data = { ...validData, horaInicio: '14:00', horaFin: '08:00' };
        expect(() => CrearAgendaMedicoEsquema.parse(data)).toThrow();
    });

    it('should reject invalid UUIDs', () => {
        const data = { ...validData, idMedico: 'not-a-uuid' };
        expect(() => CrearAgendaMedicoEsquema.parse(data)).toThrow();
    });

    it('should reject empty required fields', () => {
        expect(() => CrearAgendaMedicoEsquema.parse({})).toThrow();
    });
});
