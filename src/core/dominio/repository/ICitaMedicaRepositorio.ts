import { ICitaMedica } from "../entidades/citaMedica/ICitaMedica.js";

export interface ConflictoHorario {
    medicoOcupado: boolean;
    consultorioOcupado: boolean;
    pacienteOcupado: boolean;
}

export interface ICitaMedicaRepositorio {
    crearCita(datosCita: ICitaMedica): Promise<string>;
    listarCitas(limite?: number): Promise<ICitaMedica[]>;
    obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
    actualizarCita(idCita: string, datosCita: ICitaMedica): Promise<ICitaMedica>;
    eliminarCita(idCita: string): Promise<void>;

    verificarDisponibilidadMedico(idMedico: string, fecha: Date): Promise<boolean>;
    verificarConflictos(
        idMedico: string,
        idConsultorio: string,
        idPaciente: string,
        fechaInicio: Date,
        duracionMinutos: number,
        idCitaExcluir?: string
    ): Promise<ConflictoHorario>;
};
