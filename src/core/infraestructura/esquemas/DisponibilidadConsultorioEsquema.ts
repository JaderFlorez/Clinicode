import { z } from "zod";

export const CrearDisponibilidadConsultorioEsquema = z.object({
    idConsultorio: z.
    string()
    .uuid("El ID del consultorio debe ser un UUID válido")
    .nonempty("El ID del consultorio es obligatorio"),
    diaSemana: z.
    string()
    .nonempty("El día de la semana es obligatorio")
    .refine(
        (dia) =>
        [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
            "Domingo",
        ].includes(dia),
        {
            message:
            "El día debe ser uno de: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado o Domingo",
        }
    ),
    horaInicio: z.
    string()
    .nonempty("La hora de inicio es obligatoria")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: "Formato inválido. Usa HH:mm (por ejemplo, 08:00)",
    }),
    horaFin: z.
    string()
    .nonempty("La hora de fin es obligatoria")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: "Formato inválido. Usa HH:mm (por ejemplo, 12:00)",
    }),
    disponible: z.
    boolean()
    .optional(),
})
.superRefine((disponibilidad, ctx) => {
    if (disponibilidad.horaInicio >= disponibilidad.horaFin) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La hora de fin debe ser posterior a la hora de inicio",
            path: ["horaFin"],
        });
    }
});

export type DisponibilidadConsultorioDTO = z.infer<typeof CrearDisponibilidadConsultorioEsquema>;
