import { IAgendaMedico } from "../../dominio/entidades/agendaMedico/IAgendaMedico.js";
import { IAgendaMedicoRepositorio } from "../../dominio/repository/IAgendaMedicoRepositorio.js";


export class ActualizarAgenda {
    constructor(private readonly repo:IAgendaMedicoRepositorio ) {}

    async ejecutar (idAgenda:string, datosAgenda: IAgendaMedico): Promise<IAgendaMedico | null> {
        const agendaActualizada = this.repo.actualizarAgenda(idAgenda,datosAgenda);
        return await agendaActualizada;
    }
};