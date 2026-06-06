import { ICitaMedica } from "../../dominio/entidades/citaMedica/ICitaMedica.js";
import { ICitaMedicaRepositorio } from "../../dominio/repository/ICitaMedicaRepositorio.js";

export class ListarCitasMedicas {
    constructor(private readonly repo: ICitaMedicaRepositorio) {}

    async ejecutar(limite?: number): Promise<ICitaMedica[]> {
        const citasObtenidas = this.repo.listarCitas(limite);
        return await citasObtenidas;
    }
};
