import { IEspecialidad } from "../../dominio/entidades/especialidad/IEspecialidad.js";
import { IEspecialidadRepositorio } from "../../dominio/repository/IEspecialidadRepositorio.js";

export class ObtenerEspecialidadPorId {
    constructor(private readonly repo: IEspecialidadRepositorio) {}

    async ejecutar(idEspecialidad: string): Promise<IEspecialidad | null> {
        const especialidadObtenida = await this.repo.obtenerEspecialidadPorId(idEspecialidad);
        return especialidadObtenida;
    }
};
