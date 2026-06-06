import { IDisponibilidadConsultorioRepositorio } from "../../dominio/repository/IDisponibilidadConsultorioRepositorio.js";

export class EliminarDisponibilidadConsultorio {
    constructor(private readonly repo: IDisponibilidadConsultorioRepositorio) {}

    async ejecutar(idDisponibilidad: string): Promise<void> {
        await this.repo.eliminarDisponibilidad(idDisponibilidad);
    }
};
