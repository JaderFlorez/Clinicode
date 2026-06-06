import { z } from "zod";

export const CrearCitaMedicaEsquema = z.object({
    idPaciente: z.
    string()
    .uuid("El ID del paciente debe ser un UUID válido")
    .nonempty("El ID del paciente es obligatorio"),
    idMedico: z.
    string()
    .uuid("El ID del médico debe ser un UUID válido")
    .nonempty("El ID del médico es obligatorio"),
    idConsultorio: z.
    string()
    .uuid("El ID del consultorio debe ser un UUID válido")
    .nonempty("El ID del consultorio es obligatorio"),
    fechaCita: z.
    string()
    .nonempty("La fecha de la cita es obligatoria")
    .refine(
        (str) => !isNaN(Date.parse(str)),
        { message: "Fecha de cita inválida. Debe estar en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)." }
    )
    .transform((str) => new Date(str)),
    motivo: z.
    string()
    .max(200)
    .optional()
    .transform((val) => val ?? null),
    estado: z.
    string()
    .optional()
    .transform((val) => val ?? "Programada"),
});

export type CitaMedicaDTO = z.infer<typeof CrearCitaMedicaEsquema>;
