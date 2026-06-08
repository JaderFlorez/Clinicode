import { ICitaMedica } from "../../dominio/entidades/citaMedica/ICitaMedica.js";
import { ICitaMedicaRepositorio } from "../../dominio/repository/ICitaMedicaRepositorio.js";
import { ConflictoHorarioError, MedicoNoDisponibleError } from "../../dominio/errores.js";

export class ActualizarCitaMedica {
    constructor(private readonly repo: ICitaMedicaRepositorio) {}

    async ejecutar(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null> {
        const duracion = datosCitaMedica.duracionMinutos ?? 30;

        const disponible = await this.repo.verificarDisponibilidadMedico(
            datosCitaMedica.idMedico,
            datosCitaMedica.fechaCita
        );
        if (!disponible) {
            throw new MedicoNoDisponibleError();
        }

        const conflictos = await this.repo.verificarConflictos(
            datosCitaMedica.idMedico,
            datosCitaMedica.idConsultorio,
            datosCitaMedica.idPaciente,
            datosCitaMedica.fechaCita,
            duracion,
            idCita
        );

        if (conflictos.medicoOcupado || conflictos.consultorioOcupado || conflictos.pacienteOcupado) {
            throw new ConflictoHorarioError(conflictos);
        }

        const citaActualizada = await this.repo.actualizarCita(idCita, datosCitaMedica);
        return citaActualizada || null;
    }
};
