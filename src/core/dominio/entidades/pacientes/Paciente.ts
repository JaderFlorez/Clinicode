import { IPaciente } from "./Ipaciente.js";

export class Paciente implements IPaciente {
    tipoDocumento: string;
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: Date;
    telefono: string;
    correo: string | null;
    direccion: string;

    constructor(datosPaciente: IPaciente){
        this.tipoDocumento = datosPaciente.tipoDocumento;
        this.numeroDocumento = datosPaciente.numeroDocumento;
        this.nombres = datosPaciente.nombres;
        this.apellidos = datosPaciente.apellidos;
        this.fechaNacimiento = datosPaciente.fechaNacimiento;
        this.telefono = datosPaciente.telefono;
        this.correo = datosPaciente.correo ?? null;
        this.direccion = datosPaciente.direccion;
    }
};