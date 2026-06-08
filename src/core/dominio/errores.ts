export class ConflictoHorarioError extends Error {
    public readonly conflictos: {
        medicoOcupado: boolean;
        consultorioOcupado: boolean;
        pacienteOcupado: boolean;
    };

    constructor(conflictos: {
        medicoOcupado: boolean;
        consultorioOcupado: boolean;
        pacienteOcupado: boolean;
    }) {
        const mensajes: string[] = [];
        if (conflictos.medicoOcupado) mensajes.push("el médico ya tiene una cita en ese horario");
        if (conflictos.consultorioOcupado) mensajes.push("el consultorio ya está ocupado en ese horario");
        if (conflictos.pacienteOcupado) mensajes.push("el paciente ya tiene una cita en ese horario");

        super(`Conflicto de horario: ${mensajes.join(", ")}.`);
        this.name = "ConflictoHorarioError";
        this.conflictos = conflictos;
    }
}

export class MedicoNoDisponibleError extends Error {
    constructor() {
        super("El médico no tiene disponibilidad en la fecha y hora seleccionadas.");
        this.name = "MedicoNoDisponibleError";
    }
}
