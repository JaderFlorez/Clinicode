import { IAgendaMedico } from "../../dominio/entidades/agendaMedico/IAgendaMedico.js";
import { IAgendaMedicoRepositorio } from "../../dominio/repository/IAgendaMedicoRepositorio.js";

export class CrearAgendaMedico {
    constructor(private readonly repo: IAgendaMedicoRepositorio){}

    async ejecutar(datosAgenda:IAgendaMedico): Promise<string> {
        const idAgenda = await this.repo.crearAgenda(datosAgenda);
        return idAgenda;
    }
};