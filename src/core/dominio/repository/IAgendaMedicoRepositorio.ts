import { IAgendaMedico } from "../entidades/agendaMedico/IAgendaMedico.js";

export interface IAgendaMedicoRepositorio {
    crearAgenda(datosAgenda: IAgendaMedico): Promise<string>;

    listarAgendas(limite?: number): Promise<IAgendaMedico[]>;
    
    obtenerAgendaPorId(idAgenda: string): Promise<IAgendaMedico | null>;

    actualizarAgenda(idAgenda: string, datosAgenda: IAgendaMedico): Promise<IAgendaMedico | null>;
    
    eliminarAgenda(idAgenda: string): Promise<void>;
};