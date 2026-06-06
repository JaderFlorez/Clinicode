import { IEspecialidad } from "./IEspecialidad.js";

export class Especialidad implements IEspecialidad {
    nombre: string;
    descripcion: string | null;

    constructor(datosEspecialidad: IEspecialidad){
        this.nombre = datosEspecialidad.nombre;
        this.descripcion = datosEspecialidad.descripcion ?? null;
    }
};
