import { ICitaMedica } from "../entidades/citaMedica/ICitaMedica.js";

export interface ICitaMedicaRepositorio {
    crearCita(datosCita: ICitaMedica): Promise<string>;
    listarCitas(limite?: number): Promise<ICitaMedica[]>;
    obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
    actualizarCita(idCita: string, datosCita: ICitaMedica): Promise<ICitaMedica>;
    eliminarCita(idCita: string): Promise<void>;
};
