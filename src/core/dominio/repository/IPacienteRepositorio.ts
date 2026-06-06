import { IPaciente } from "../entidades/pacientes/Ipaciente.js";

export interface IPacienteRepositorio {
    crearPaciente(datosPaciente: IPaciente): Promise<string>;
    listarPacientes(limite?: number): Promise<IPaciente[]>;
    obtenerPacientePorId(idPaciente: string): Promise<IPaciente | null>;
    actualizarPaciente(idPaciente: string, datosPaciente: IPaciente): Promise<IPaciente>;
    eliminarPaciente(idPaciente: string): Promise<void>;
};