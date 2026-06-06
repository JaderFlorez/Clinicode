import { IAgendaMedicoRepositorio } from "../../dominio/repository/IAgendaMedicoRepositorio.js";

export class EliminarAgenda {
    constructor(private readonly repo: IAgendaMedicoRepositorio){}

    async ejecutar(idAgenda: string): Promise<void> {
        await this.repo.eliminarAgenda(idAgenda);
    }
};