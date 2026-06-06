
export interface IPaciente {
    idPaciente?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: Date;
    telefono: string;
    correo?: string | null;
    direccion: string;
};