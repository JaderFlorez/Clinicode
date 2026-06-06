import { ICitaMedica } from "../../dominio/entidades/citaMedica/ICitaMedica.js";
import { ICitaMedicaRepositorio } from "../../dominio/repository/ICitaMedicaRepositorio.js";
import { db } from "../cliente-db/clientePostgres.js";
import { v4 as uuidv4 } from "uuid";

export class CitaMedicaRepositorio implements ICitaMedicaRepositorio {

    async crearCita(datosCita: ICitaMedica): Promise<string> {
        const id = uuidv4();
        const { rows } = await db.query(
            `INSERT INTO "citas_medicas" (id_cita, id_paciente, id_medico, id_consultorio, fecha_cita, motivo, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_cita`,
            [id, datosCita.idPaciente, datosCita.idMedico, datosCita.idConsultorio, datosCita.fechaCita, datosCita.motivo ?? null, datosCita.estado ?? "Programada"]
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
            `UPDATE "citas_medicas" SET id_paciente = $1, id_medico = $2, id_consultorio = $3, fecha_cita = $4, motivo = $5, estado = $6 WHERE id_cita = $7 RETURNING id_cita, id_paciente, id_medico, id_consultorio, fecha_cita, motivo, estado`,
            [datosCita.idPaciente, datosCita.idMedico, datosCita.idConsultorio, datosCita.fechaCita, datosCita.motivo ?? null, datosCita.estado ?? "Programada", idCita]
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

    private mapearCita(row: Record<string, unknown>): ICitaMedica {
        return {
            idCita: row.id_cita as string,
            idPaciente: row.id_paciente as string,
            idMedico: row.id_medico as string,
            idConsultorio: row.id_consultorio as string,
            fechaCita: row.fecha_cita as Date,
            motivo: (row.motivo as string | null) ?? null,
            estado: row.estado as string,
        };
    }
}
