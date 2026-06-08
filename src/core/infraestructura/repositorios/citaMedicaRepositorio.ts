import { ConflictoHorario, ICitaMedicaRepositorio } from "../../dominio/repository/ICitaMedicaRepositorio.js";
import { ICitaMedica } from "../../dominio/entidades/citaMedica/ICitaMedica.js";
import { db } from "../cliente-db/clientePostgres.js";
import { v4 as uuidv4 } from "uuid";

export const DIAS_SPANISH = [
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

export class CitaMedicaRepositorio implements ICitaMedicaRepositorio {

    async crearCita(datosCita: ICitaMedica): Promise<string> {
        const id = uuidv4();
        const { rows } = await db.query(
            `INSERT INTO "citas_medicas" (id_cita, id_paciente, id_medico, id_consultorio, fecha_cita, motivo, estado, duracion_minutos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_cita`,
            [id, datosCita.idPaciente, datosCita.idMedico, datosCita.idConsultorio, datosCita.fechaCita, datosCita.motivo ?? null, datosCita.estado ?? "Programada", datosCita.duracionMinutos ?? 30]
        );
        return rows[0].id_cita;
    }

    async listarCitas(limite?: number): Promise<ICitaMedica[]> {
        let query = `SELECT id_cita, id_paciente, id_medico, id_consultorio, fecha_cita, motivo, estado FROM "citas_medicas" ORDER BY fecha_cita DESC`;
        const params: unknown[] = [];
        if (limite) {
            query += ` LIMIT $1`;
            params.push(limite);
        }
        const { rows } = await db.query(query, params);
        return rows.map(row => this.mapearCita(row));
    }

    async obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null> {
        const { rows } = await db.query(
            `SELECT id_cita, id_paciente, id_medico, id_consultorio, fecha_cita, motivo, estado FROM "citas_medicas" WHERE id_cita = $1`,
            [idCita]
        );
        if (rows.length === 0) return null;
        return this.mapearCita(rows[0]);
    }

    async actualizarCita(idCita: string, datosCita: ICitaMedica): Promise<ICitaMedica> {
        const { rows } = await db.query(
            `UPDATE "citas_medicas" SET id_paciente = $1, id_medico = $2, id_consultorio = $3, fecha_cita = $4, motivo = $5, estado = $6, duracion_minutos = $7 WHERE id_cita = $8 RETURNING id_cita, id_paciente, id_medico, id_consultorio, fecha_cita, motivo, estado, duracion_minutos`,
            [datosCita.idPaciente, datosCita.idMedico, datosCita.idConsultorio, datosCita.fechaCita, datosCita.motivo ?? null, datosCita.estado ?? "Programada", datosCita.duracionMinutos ?? 30, idCita]
        );
        if (rows.length === 0) {
            throw new Error("Cita no encontrada");
        }
        return this.mapearCita(rows[0]);
    }

    async eliminarCita(idCita: string): Promise<void> {
        const { rowCount } = await db.query(
            `DELETE FROM "citas_medicas" WHERE id_cita = $1`,
            [idCita]
        );
        if (rowCount === 0) {
            throw new Error("Cita no encontrada");
        }
    }

    async verificarDisponibilidadMedico(idMedico: string, fecha: Date): Promise<boolean> {
        const diaSemana = DIAS_SPANISH[fecha.getDay()];
        const hora = fecha.toTimeString().slice(0, 5);

        const { rows } = await db.query(
            `SELECT id_agenda FROM "agenda_medico"
             WHERE id_medico = $1
               AND $2 = ANY(dias_disponibles)
               AND $3::time >= hora_inicio
               AND $3::time <= hora_fin
             LIMIT 1`,
            [idMedico, diaSemana, hora]
        );
        return rows.length > 0;
    }

    async verificarConflictos(
        idMedico: string,
        idConsultorio: string,
        idPaciente: string,
        fechaInicio: Date,
        duracionMinutos: number,
        idCitaExcluir?: string
    ): Promise<ConflictoHorario> {
        const excluir = idCitaExcluir ?? "00000000-0000-0000-0000-000000000000";

        const { rows } = await db.query(
            `SELECT
               EXISTS (
                 SELECT 1 FROM "citas_medicas"
                 WHERE id_cita != $1
                   AND id_medico = $2
                   AND fecha_cita < $3::timestamp + $4 * interval '1 minute'
                   AND $3::timestamp < fecha_cita + COALESCE(duracion_minutos, 30) * interval '1 minute'
               ) AS medico_ocupado,
               EXISTS (
                 SELECT 1 FROM "citas_medicas"
                 WHERE id_cita != $1
                   AND id_consultorio = $5
                   AND fecha_cita < $3::timestamp + $4 * interval '1 minute'
                   AND $3::timestamp < fecha_cita + COALESCE(duracion_minutos, 30) * interval '1 minute'
               ) AS consultorio_ocupado,
               EXISTS (
                 SELECT 1 FROM "citas_medicas"
                 WHERE id_cita != $1
                   AND id_paciente = $6
                   AND fecha_cita < $3::timestamp + $4 * interval '1 minute'
                   AND $3::timestamp < fecha_cita + COALESCE(duracion_minutos, 30) * interval '1 minute'
               ) AS paciente_ocupado`,
            [excluir, idMedico, fechaInicio, duracionMinutos, idConsultorio, idPaciente]
        );

        return {
            medicoOcupado: rows[0].medico_ocupado,
            consultorioOcupado: rows[0].consultorio_ocupado,
            pacienteOcupado: rows[0].paciente_ocupado,
        };
    }

    private mapearCita(row: Record<string, unknown>): ICitaMedica {
        return {
            idCita: row.id_cita as string,
            idPaciente: row.id_paciente as string,
            idMedico: row.id_medico as string,
            idConsultorio: row.id_consultorio as string,
            fechaCita: row.fecha_cita as Date,
            motivo: (row.motivo as string | null) ?? null,
            estado: row.estado as string,
            duracionMinutos: (row.duracion_minutos as number) ?? 30,
        };
    }
}
