import { IDisponibilidadConsultorio } from "../../dominio/entidades/disponibilidadConsultorio/IDisponibilidadConsultorio.js";
import { IDisponibilidadConsultorioRepositorio } from "../../dominio/repository/IDisponibilidadConsultorioRepositorio.js";

export class ActualizarDisponibilidadConsultorio {
    constructor(private readonly repo: IDisponibilidadConsultorioRepositorio) {}

    async ejecutar(idDisponibilidad: string, datosDisponibilidad: IDisponibilidadConsultorio): Promise<IDisponibilidadConsultorio | null> {
        const disponibilidadActualizada = await this.repo.actualizarDisponibilidad(idDisponibilidad, datosDisponibilidad);
        return disponibilidadActualizada || null;
    }
};
