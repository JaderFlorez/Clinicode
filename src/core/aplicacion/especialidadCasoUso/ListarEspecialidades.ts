import { IEspecialidad } from "../../dominio/entidades/especialidad/IEspecialidad.js";
import { IEspecialidadRepositorio } from "../../dominio/repository/IEspecialidadRepositorio.js";

export class ListarEspecialidades {
    constructor(private readonly repo: IEspecialidadRepositorio) {}

    async ejecutar(limite?: number): Promise<IEspecialidad[]> {
        const especialidadesObtenidas = this.repo.listarEspecialidades(limite);
        return await especialidadesObtenidas;
    }
};
