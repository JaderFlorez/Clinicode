import { ICitaMedica } from "../../dominio/entidades/citaMedica/ICitaMedica.js";
import { ICitaMedicaRepositorio } from "../../dominio/repository/ICitaMedicaRepositorio.js";


export class CrearCitaMedica {
    constructor(private readonly repo: ICitaMedicaRepositorio) {}

    async ejecutar(datosCitaMedica: ICitaMedica): Promise<string> {
        const idCita = await this.repo.crearCita(datosCitaMedica);
        return idCita;
    }
};
