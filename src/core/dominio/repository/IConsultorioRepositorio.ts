
import { IConsultorio } from "../entidades/consultorio/IConsultorio.js";

export interface IConsultorioRepositorio {
    crearConsultorio(datosConsultorio: IConsultorio): Promise<string>;
    listarConsultorios(limite?: number): Promise<IConsultorio[]>;
    obtenerConsultorioPorId(idConsultorio: string): Promise<IConsultorio | null>;
    actualizarConsultorio(idConsultorio: string, datosConsultorio: IConsultorio): Promise<IConsultorio>;
    eliminarConsultorio(idConsultorio: string): Promise<void>;
};

