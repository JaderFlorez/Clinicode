import { IMedico } from "../../dominio/entidades/medico/IMedico.js";
import { IMedicoRepositorio } from "../../dominio/repository/IMedicoRepositorio.js";

export class ListarMedicos {
    constructor(private readonly repo: IMedicoRepositorio) {}

    async ejecutar(limite?: number): Promise<IMedico[]> {
        const medicosObtenidos = this.repo.listarMedicos(limite);
        return await medicosObtenidos;
    }
};
