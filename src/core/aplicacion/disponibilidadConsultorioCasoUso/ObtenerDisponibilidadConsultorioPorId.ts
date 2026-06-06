import { IDisponibilidadConsultorio } from "../../dominio/entidades/disponibilidadConsultorio/IDisponibilidadConsultorio.js";
import { IDisponibilidadConsultorioRepositorio } from "../../dominio/repository/IDisponibilidadConsultorioRepositorio.js";

export class ObtenerDisponibilidadConsultorioPorId {
    constructor(private readonly repo: IDisponibilidadConsultorioRepositorio) {}

    async ejecutar(idDisponibilidad: string): Promise<IDisponibilidadConsultorio | null> {
        const disponibilidadObtenida = await this.repo.obtenerDisponibilidadPorId(idDisponibilidad);
        return disponibilidadObtenida;
    }
};
