import { IConsultorio } from "../../dominio/entidades/consultorio/IConsultorio.js";
import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio.js";

export class ActualizarConsultorio {
    constructor(private readonly repo: IConsultorioRepositorio) {}

    async ejecutar(idConsultorio: string, datosConsultorio: IConsultorio): Promise<IConsultorio | null> {
        const consultorioActualizado = await this.repo.actualizarConsultorio(idConsultorio, datosConsultorio);
        return consultorioActualizado || null;
    }
};
