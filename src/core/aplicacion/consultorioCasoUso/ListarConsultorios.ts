import { IConsultorio } from "../../dominio/entidades/consultorio/IConsultorio.js";
import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio.js";

export class ListarConsultorios {
    constructor(private readonly repo: IConsultorioRepositorio) {}

    async ejecutar(limite?: number): Promise<IConsultorio[]> {
        const consultoriosObtenidos = this.repo.listarConsultorios(limite);
        return await consultoriosObtenidos;
    }
};
