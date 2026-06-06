import { IMedico } from "../../dominio/entidades/medico/IMedico.js";
import { IMedicoRepositorio } from "../../dominio/repository/IMedicoRepositorio.js";

export class ActualizarMedico {
    constructor(private readonly repo: IMedicoRepositorio) {}

    async ejecutar(idMedico: string, datosMedico: IMedico): Promise<IMedico | null> {
        const medicoActualizado = await this.repo.actualizarMedico(idMedico, datosMedico);
        return medicoActualizado || null;
    }
};
