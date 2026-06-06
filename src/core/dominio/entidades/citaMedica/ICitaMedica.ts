
export interface ICitaMedica {
    idCita?: string;
    idPaciente: string;
    idMedico: string;
    idConsultorio: string;
    fechaCita: Date;
    motivo?: string | null;
    estado?: string;
};
