import { ICitaMedica } from "../../dominio/entidades/citaMedica/ICitaMedica.js";
import { ICitaMedicaRepositorio } from "../../dominio/repository/ICitaMedicaRepositorio.js";

export class ActualizarCitaMedica {
    constructor(private readonly repo: ICitaMedicaRepositorio) {}

    async ejecutar(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null> {
        const citaActualizada = await this.repo.actualizarCita(idCita, datosCitaMedica);
        return citaActualizada || null;
    }
};
