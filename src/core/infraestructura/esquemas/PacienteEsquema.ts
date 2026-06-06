import { z } from "zod";

export const CrearPacienteEsquema = z.object({
    tipoDocumento: z.
    string()
    .nonempty("El tipo de documento es obligatorio")
    .max(10),
    numeroDocumento: z.
    string()
    .nonempty("El número de documento del paciente es obligatorio")
    .max(20),
    nombres: z
    .string()
    .nonempty("Los nombres del paciente son obligatorios")
    .max(100),
    apellidos: z.
    string()
    .nonempty("Los apellidos del paciente son obligatorios")
    .max(100),
    fechaNacimiento: z.
    string()
    .nonempty ("La fecha de nacimiento del paciente es obligatoria")
    .refine(
        (str) => !isNaN(Date.parse(str)),
        { message: "Fecha de nacimiento inválida. Debe estar en formato ISO 8601 (YYYY-MM-DD)." }
    )
    .transform((str) => new Date(str))
    .refine((date) => date < new Date(), {
        message: "La fecha de nacimiento no puede ser en el futuro."
    }),
    telefono: z.
    string()
    .nonempty("El teléfono del paciente es obligatorio")
    .max(20),
    correo: z.
    string()
    .optional()
    .transform((val) => val ?? null),
    direccion: z.
    string()
    .nonempty("La dirección del paciente es obligatoria")
});

export type PacienteDTO = z.infer<typeof CrearPacienteEsquema>;