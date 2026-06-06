import { IEspecialidad } from "../../dominio/entidades/especialidad/IEspecialidad.js";
import { IEspecialidadRepositorio } from "../../dominio/repository/IEspecialidadRepositorio.js";

export class ActualizarEspecialidad {
    constructor(private readonly repo: IEspecialidadRepositorio) {}

    async ejecutar(idEspecialidad: string, datosEspecialidad: IEspecialidad): Promise<IEspecialidad | null> {
        const especialidadActualizada = await this.repo.actualizarEspecialidad(idEspecialidad, datosEspecialidad);
        return especialidadActualizada || null;
    }
};
