import { IEspecialidad } from "../../dominio/entidades/especialidad/IEspecialidad.js";
import { IEspecialidadRepositorio } from "../../dominio/repository/IEspecialidadRepositorio.js";


export class CrearEspecialidad {
    constructor(private readonly repo: IEspecialidadRepositorio) {}

    async ejecutar(datosEspecialidad: IEspecialidad): Promise<string> {
        const idEspecialidad = await this.repo.crearEspecialidad(datosEspecialidad);
        return idEspecialidad;
    }
};
