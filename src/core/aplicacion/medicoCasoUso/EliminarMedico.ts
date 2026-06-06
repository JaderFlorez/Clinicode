import { IMedicoRepositorio } from "../../dominio/repository/IMedicoRepositorio.js";

export class EliminarMedico {
    constructor(private readonly repo: IMedicoRepositorio) {}

    async ejecutar(idMedico: string): Promise<void> {
        await this.repo.eliminarMedico(idMedico);
    }
};
