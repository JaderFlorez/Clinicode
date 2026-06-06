import { IDisponibilidadConsultorio } from "./IDisponibilidadConsultorio.js";

export class DisponibilidadConsultorio implements IDisponibilidadConsultorio {
    idConsultorio: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    disponible: boolean;

    constructor(datosDisponibilidad: IDisponibilidadConsultorio){
        this.idConsultorio = datosDisponibilidad.idConsultorio;
        this.diaSemana = datosDisponibilidad.diaSemana;
        this.horaInicio = datosDisponibilidad.horaInicio;
        this.horaFin = datosDisponibilidad.horaFin;
        this.disponible = datosDisponibilidad.disponible ?? true;
    }
};
