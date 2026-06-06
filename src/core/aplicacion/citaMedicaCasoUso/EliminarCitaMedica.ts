import { ICitaMedicaRepositorio } from "../../dominio/repository/ICitaMedicaRepositorio.js";

export class EliminarCitaMedica {
    constructor(private readonly repo: ICitaMedicaRepositorio) {}

    async ejecutar(idCita: string): Promise<void> {
        await this.repo.eliminarCita(idCita);
    }
};
