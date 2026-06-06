import { IDisponibilidadConsultorio } from "../../dominio/entidades/disponibilidadConsultorio/IDisponibilidadConsultorio.js";
import { IDisponibilidadConsultorioRepositorio } from "../../dominio/repository/IDisponibilidadConsultorioRepositorio.js";


export class CrearDisponibilidadConsultorio {
    constructor(private readonly repo: IDisponibilidadConsultorioRepositorio) {}

    async ejecutar(datosDisponibilidad: IDisponibilidadConsultorio): Promise<string> {
        const idDisponibilidad = await this.repo.crearDisponibilidad(datosDisponibilidad);
        return idDisponibilidad;
    }
};
