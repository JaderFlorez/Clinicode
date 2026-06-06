import { IConsultorio } from "../../dominio/entidades/consultorio/IConsultorio.js";
import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio.js";


export class CrearConsultorio {
    constructor(private readonly repo: IConsultorioRepositorio) {}

    async ejecutar(datosConsultorio: IConsultorio): Promise<string> {
        const idConsultorio = await this.repo.crearConsultorio(datosConsultorio);
        return idConsultorio;
    }
};
