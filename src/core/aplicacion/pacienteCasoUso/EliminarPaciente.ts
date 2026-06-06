import { IPacienteRepositorio } from "../../dominio/repository/IPacienteRepositorio.js";

export class EliminarPaciente {
    constructor(private readonly repo: IPacienteRepositorio) {}

    async ejecutar(idPaciente: string): Promise<void>{
        await this.repo.eliminarPaciente(idPaciente);
    }
};
