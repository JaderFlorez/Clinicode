import { z } from "zod";

export const CrearEspecialidadEsquema = z.object({
    nombre: z.
    string()
    .nonempty("El nombre de la especialidad es obligatorio")
    .max(100),
    descripcion: z.
    string()
    .optional()
    .transform((val) => val ?? null),
});

export type EspecialidadDTO = z.infer<typeof CrearEspecialidadEsquema>;
