import { ICitaMedica } from "../../dominio/entidades/citaMedica/ICitaMedica.js";
import { ICitaMedicaRepositorio } from "../../dominio/repository/ICitaMedicaRepositorio.js";

export class ObtenerCitaMedicaPorId {
    constructor(private readonly repo: ICitaMedicaRepositorio) {}

    async ejecutar(idCita: string): Promise<ICitaMedica | null> {
        const citaObtenida = await this.repo.obtenerCitaPorId(idCita);
        return citaObtenida;
    }
};
