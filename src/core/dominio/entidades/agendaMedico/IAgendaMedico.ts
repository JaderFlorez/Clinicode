
export interface IAgendaMedico {
    idAgenda?:string;
    idMedico: string;
    idConsultorio: string;
    diasDisponibles: string[];
    horaInicio: string;
    horaFin: string;
    creadaEn?: string;
};