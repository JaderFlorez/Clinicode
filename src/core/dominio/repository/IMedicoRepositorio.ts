import { IMedico } from "../entidades/medico/IMedico.js";

export interface IMedicoRepositorio {
    crearMedico(datosMedico: IMedico): Promise<string>;
    listarMedicos(limite?: number): Promise<IMedico[]>;
    obtenerMedicoPorId(idMedico: string): Promise<IMedico | null>;
    actualizarMedico(idMedico: string, datosMedico: IMedico): Promise<IMedico>;
    eliminarMedico(idMedico: string): Promise<void>;
};
