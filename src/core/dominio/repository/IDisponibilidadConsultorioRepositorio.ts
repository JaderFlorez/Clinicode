import { IDisponibilidadConsultorio } from "../entidades/disponibilidadConsultorio/IDisponibilidadConsultorio.js";

export interface IDisponibilidadConsultorioRepositorio {
    crearDisponibilidad(datosDisponibilidad: IDisponibilidadConsultorio): Promise<string>;
    listarDisponibilidades(limite?: number): Promise<IDisponibilidadConsultorio[]>;
    obtenerDisponibilidadPorId(idDisponibilidad: string): Promise<IDisponibilidadConsultorio | null>;
    actualizarDisponibilidad(idDisponibilidad: string, datosDisponibilidad: IDisponibilidadConsultorio): Promise<IDisponibilidadConsultorio>;
    eliminarDisponibilidad(idDisponibilidad: string): Promise<void>;
};
