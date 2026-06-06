
export interface IMedico {
    idMedico?: string;
    nombres: string;
    apellidos: string;
    numeroLicencia: string;
    idEspecialidad: string;
    telefono?: string | null;
    correo?: string | null;
};
