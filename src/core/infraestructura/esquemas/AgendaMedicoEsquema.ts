import { z } from "zod";

export const CrearAgendaMedicoEsquema = z
.object({
    idMedico: z
    .string()
    .uuid("El ID del médico debe ser un UUID válido")
    .nonempty("El ID del médico es obligatorio"),

    idConsultorio: z
    .string()
    .uuid("El ID del consultorio debe ser un UUID válido")
    .nonempty("El ID del consultorio es obligatorio"),

    diasDisponibles: z
    .array(
    z
        .string()
        .nonempty("Cada día debe ser una cadena de texto")
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
        )
    )
    .nonempty("Debe asignar al menos un día disponible al médico"),

    horaInicio: z
    .string()
    .nonempty("La hora de inicio es obligatoria")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: "Formato inválido. Usa HH:mm (por ejemplo, 08:00)",
    }),

    horaFin: z
    .string()
    .nonempty("La hora de fin es obligatoria")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: "Formato inválido. Usa HH:mm (por ejemplo, 12:00)",
    })
})
.superRefine((agenda, ctx) => {
    if (agenda.horaInicio >= agenda.horaFin) {
    ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La hora de fin debe ser posterior a la hora de inicio",
        path: ["horaFin"], // para que el error aparezca bajo ese campo
    });
}
});

export type AgendaMedicoDTO = z.infer<typeof CrearAgendaMedicoEsquema>;
