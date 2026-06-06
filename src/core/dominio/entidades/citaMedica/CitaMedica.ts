import { ICitaMedica } from "./ICitaMedica.js";

export class CitaMedica implements ICitaMedica {
    idPaciente: string;
    idMedico: string;
    idConsultorio: string;
    fechaCita: Date;
    motivo: string | null;
    estado: string;

    constructor(datosCitaMedica: ICitaMedica){
        this.idPaciente = datosCitaMedica.idPaciente;
        this.idMedico = datosCitaMedica.idMedico;
        this.idConsultorio = datosCitaMedica.idConsultorio;
        this.fechaCita = datosCitaMedica.fechaCita;
        this.motivo = datosCitaMedica.motivo ?? null;
        this.estado = datosCitaMedica.estado ?? "Programada";
    }
};
