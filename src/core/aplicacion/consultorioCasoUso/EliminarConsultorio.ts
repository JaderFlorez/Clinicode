import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio.js";

export class EliminarConsultorio {
    constructor(private readonly repo: IConsultorioRepositorio) {}

    async ejecutar(idConsultorio: string): Promise<void> {
        await this.repo.eliminarConsultorio(idConsultorio);
    }
};
