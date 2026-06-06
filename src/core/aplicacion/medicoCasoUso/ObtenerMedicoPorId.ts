import { IMedico } from "../../dominio/entidades/medico/IMedico.js";
import { IMedicoRepositorio } from "../../dominio/repository/IMedicoRepositorio.js";

export class ObtenerMedicoPorId {
    constructor(private readonly repo: IMedicoRepositorio) {}

    async ejecutar(idMedico: string): Promise<IMedico | null> {
        const medicoObtenido = await this.repo.obtenerMedicoPorId(idMedico);
        return medicoObtenido;
    }
};
