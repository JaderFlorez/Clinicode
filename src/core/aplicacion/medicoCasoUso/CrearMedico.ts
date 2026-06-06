import { IMedico } from "../../dominio/entidades/medico/IMedico.js";
import { IMedicoRepositorio } from "../../dominio/repository/IMedicoRepositorio.js";


export class CrearMedico {
    constructor(private readonly repo: IMedicoRepositorio) {}

    async ejecutar(datosMedico: IMedico): Promise<string> {
        const idMedico = await this.repo.crearMedico(datosMedico);
        return idMedico;
    }
};
