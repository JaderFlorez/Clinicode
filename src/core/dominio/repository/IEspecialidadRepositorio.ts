import { IEspecialidad } from "../entidades/especialidad/IEspecialidad.js";

export interface IEspecialidadRepositorio {
    crearEspecialidad(datosEspecialidad: IEspecialidad): Promise<string>;
    listarEspecialidades(limite?: number): Promise<IEspecialidad[]>;
    obtenerEspecialidadPorId(idEspecialidad: string): Promise<IEspecialidad | null>;
    actualizarEspecialidad(idEspecialidad: string, datosEspecialidad: IEspecialidad): Promise<IEspecialidad>;
    eliminarEspecialidad(idEspecialidad: string): Promise<void>;
};
