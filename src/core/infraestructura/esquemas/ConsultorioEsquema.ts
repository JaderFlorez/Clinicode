import { z } from "zod";

export const CrearConsultorioEsquema = z.object({
    nombre: z.
    string()
    .nonempty("El nombre del consultorio es obligatorio")
    .max(50),
    ubicacion: z.
    string()
    .max(100)
    .optional()
    .transform((val) => val ?? null),
    disponible: z.
    boolean()
    .optional(),
});

export type ConsultorioDTO = z.infer<typeof CrearConsultorioEsquema>;
