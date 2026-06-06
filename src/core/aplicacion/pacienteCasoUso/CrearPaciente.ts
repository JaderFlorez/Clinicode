import { IPaciente } from "../../dominio/entidades/pacientes/Ipaciente.js";
import { IPacienteRepositorio } from "../../dominio/repository/IPacienteRepositorio.js";


export class CrearPaciente {
    constructor(private readonly repo: IPacienteRepositorio) {}

    async ejecutar(datosPaciente:IPaciente): Promise<string> {
        const idPaciente = await this.repo.crearPaciente(datosPaciente);
        return idPaciente; 
    }
};