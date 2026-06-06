import { z } from "zod";

export const CrearMedicoEsquema = z.object({
    nombres: z.
    string()
    .nonempty("Los nombres del médico son obligatorios")
    .max(100),
    apellidos: z.
    string()
    .nonempty("Los apellidos del médico son obligatorios")
    .max(100),
    numeroLicencia: z.
    string()
    .nonempty("El número de licencia es obligatorio")
    .max(50),
    idEspecialidad: z.
    string()
    .uuid("El ID de la especialidad debe ser un UUID válido")
    .nonempty("El ID de la especialidad es obligatorio"),
    telefono: z.
    string()
    .max(20)
    .optional()
    .transform((val) => val ?? null),
    correo: z.
    string()
    .optional()
    .transform((val) => val ?? null),
});

export type MedicoDTO = z.infer<typeof CrearMedicoEsquema>;
