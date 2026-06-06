import { IDisponibilidadConsultorio } from "../../dominio/entidades/disponibilidadConsultorio/IDisponibilidadConsultorio.js";
import { IDisponibilidadConsultorioRepositorio } from "../../dominio/repository/IDisponibilidadConsultorioRepositorio.js";

export class ListarDisponibilidadesConsultorio {
    constructor(private readonly repo: IDisponibilidadConsultorioRepositorio) {}

    async ejecutar(limite?: number): Promise<IDisponibilidadConsultorio[]> {
        const disponibilidadesObtenidas = this.repo.listarDisponibilidades(limite);
        return await disponibilidadesObtenidas;
    }
};
