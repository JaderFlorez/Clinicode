
export interface IDisponibilidadConsultorio {
    idDisponibilidad?: string;
    idConsultorio: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    disponible?: boolean;
};
