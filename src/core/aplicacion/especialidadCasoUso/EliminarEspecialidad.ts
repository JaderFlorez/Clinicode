import { IEspecialidadRepositorio } from "../../dominio/repository/IEspecialidadRepositorio.js";

export class EliminarEspecialidad {
    constructor(private readonly repo: IEspecialidadRepositorio) {}

    async ejecutar(idEspecialidad: string): Promise<void> {
        await this.repo.eliminarEspecialidad(idEspecialidad);
    }
};
