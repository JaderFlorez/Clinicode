import { ICitaMedica } from "../../dominio/entidades/citaMedica/ICitaMedica.js";
import { ICitaMedicaRepositorio } from "../../dominio/repository/ICitaMedicaRepositorio.js";
import { ConflictoHorarioError, MedicoNoDisponibleError } from "../../dominio/errores.js";


export class CrearCitaMedica {
    constructor(private readonly repo: ICitaMedicaRepositorio) {}

    async ejecutar(datosCitaMedica: ICitaMedica): Promise<string> {
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
            duracion
        );

        if (conflictos.medicoOcupado || conflictos.consultorioOcupado || conflictos.pacienteOcupado) {
            throw new ConflictoHorarioError(conflictos);
        }

        const idCita = await this.repo.crearCita(datosCitaMedica);
        return idCita;
    }
};
