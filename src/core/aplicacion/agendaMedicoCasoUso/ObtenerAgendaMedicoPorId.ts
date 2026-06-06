import { IAgendaMedico } from "../../dominio/entidades/agendaMedico/IAgendaMedico.js";
import { IAgendaMedicoRepositorio } from "../../dominio/repository/IAgendaMedicoRepositorio.js";

export class ObtenerAgendaPorId {
    constructor(private readonly repo: IAgendaMedicoRepositorio){}

    async ejecutar (idAgenda:string): Promise<IAgendaMedico | null>{
        const agendaObtenida = this.repo.obtenerAgendaPorId(idAgenda);
        return await agendaObtenida;
    }
};