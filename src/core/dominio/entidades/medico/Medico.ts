import { IMedico } from "./IMedico.js";

export class Medico implements IMedico {
    nombres: string;
    apellidos: string;
    numeroLicencia: string;
    idEspecialidad: string;
    telefono: string | null;
    correo: string | null;

    constructor(datosMedico: IMedico){
        this.nombres = datosMedico.nombres;
        this.apellidos = datosMedico.apellidos;
        this.numeroLicencia = datosMedico.numeroLicencia;
        this.idEspecialidad = datosMedico.idEspecialidad;
        this.telefono = datosMedico.telefono ?? null;
        this.correo = datosMedico.correo ?? null;
    }
};
