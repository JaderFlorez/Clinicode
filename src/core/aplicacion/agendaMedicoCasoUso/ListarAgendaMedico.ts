import { IAgendaMedico } from "../../dominio/entidades/agendaMedico/IAgendaMedico.js";
import { IAgendaMedicoRepositorio } from "../../dominio/repository/IAgendaMedicoRepositorio.js";

export class ListarAgendaMedico {
    constructor(private readonly repo: IAgendaMedicoRepositorio) {}

    async ejecutar(limite?:number): Promise<IAgendaMedico[]> {
        const agendasObtenidas = this.repo.listarAgendas(limite);
        return await agendasObtenidas;

    }
};