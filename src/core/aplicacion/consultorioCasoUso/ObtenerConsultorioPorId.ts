import { IConsultorio } from "../../dominio/entidades/consultorio/IConsultorio.js";
import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio.js";

export class ObtenerConsultorioPorId {
    constructor(private readonly repo: IConsultorioRepositorio) {}

    async ejecutar(idConsultorio: string): Promise<IConsultorio | null> {
        const consultorioObtenido = await this.repo.obtenerConsultorioPorId(idConsultorio);
        return consultorioObtenido;
    }
};
