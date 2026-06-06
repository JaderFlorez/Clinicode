import { IConsultorio } from "./IConsultorio.js";

export class Consultorio implements IConsultorio {
    nombre: string;
    ubicacion: string | null;
    disponible: boolean;

    constructor(datosConsultorio: IConsultorio){
        this.nombre = datosConsultorio.nombre;
        this.ubicacion = datosConsultorio.ubicacion ?? null;
        this.disponible = datosConsultorio.disponible ?? true;
    }
};
