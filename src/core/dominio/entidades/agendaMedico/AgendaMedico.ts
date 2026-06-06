import { IAgendaMedico } from "./IAgendaMedico.js";

export class AgendaMedico implements IAgendaMedico{
    idMedico: string;
    idConsultorio: string;
    diasDisponibles: string[];
    horaInicio: string;
    horaFin: string;
    constructor(datosAgenda: IAgendaMedico){
        this.idMedico = datosAgenda.idMedico;
        this.idConsultorio = datosAgenda.idConsultorio;
        this.diasDisponibles = datosAgenda.diasDisponibles;
        this.horaInicio = datosAgenda.horaInicio;
        this.horaFin = datosAgenda.horaFin;
    }
};