import { IAgendaMedico } from "../../dominio/entidades/agendaMedico/IAgendaMedico.js";
import { IAgendaMedicoRepositorio } from "../../dominio/repository/IAgendaMedicoRepositorio.js";
import { db } from "../cliente-db/clientePostgres.js";
import { v4 as uuidv4 } from "uuid";

export class AgendaMedicoRepositorio implements IAgendaMedicoRepositorio {

    async crearAgenda(datosAgenda: IAgendaMedico): Promise<string> {
        const { rows: medico } = await db.query(
            `SELECT id_medico FROM "medicos" WHERE id_medico = $1`,
            [datosAgenda.idMedico]
        );
        if (medico.length === 0) {
            throw new Error("El médico especificado no existe");
        }

        const { rows: consultorio } = await db.query(
            `SELECT id_consultorio FROM "consultorios" WHERE id_consultorio = $1`,
            [datosAgenda.idConsultorio]
        );
        if (consultorio.length === 0) {
            throw new Error("El consultorio especificado no existe");
        }

        const { rows: asignacionExistente } = await db.query(
            `SELECT id_agenda FROM "agenda_medico" WHERE id_medico = $1 AND id_consultorio = $2 AND hora_inicio = $3 AND hora_fin = $4`,
            [datosAgenda.idMedico, datosAgenda.idConsultorio, datosAgenda.horaInicio, datosAgenda.horaFin]
        );
        if (asignacionExistente.length > 0) {
            throw new Error("Ya existe una asignación idéntica para este médico, consultorio y horario");
        }

        const id = uuidv4();
        const { rows } = await db.query(
            `INSERT INTO "agenda_medico" (id_agenda, id_medico, id_consultorio, dias_disponibles, hora_inicio, hora_fin, creada_en) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_agenda`,
            [id, datosAgenda.idMedico, datosAgenda.idConsultorio, datosAgenda.diasDisponibles, datosAgenda.horaInicio, datosAgenda.horaFin, new Date().toISOString()]
        );
        return rows[0].id_agenda;
    }

    async listarAgendas(limite?: number): Promise<IAgendaMedico[]> {
        let query = `SELECT id_agenda, id_medico, id_consultorio, dias_disponibles, hora_inicio, hora_fin, creada_en FROM "agenda_medico" ORDER BY creada_en DESC`;
        const params: unknown[] = [];
        if (limite) {
            query += ` LIMIT $1`;
            params.push(limite);
        }
        const { rows } = await db.query(query, params);
        return rows.map(row => this.mapearAgenda(row));
    }

    async obtenerAgendaPorId(idAgenda: string): Promise<IAgendaMedico | null> {
        const { rows } = await db.query(
            `SELECT id_agenda, id_medico, id_consultorio, dias_disponibles, hora_inicio, hora_fin, creada_en FROM "agenda_medico" WHERE id_agenda = $1`,
            [idAgenda]
        );
        if (rows.length === 0) return null;
        return this.mapearAgenda(rows[0]);
    }

    async actualizarAgenda(idAgenda: string, datosAgenda: IAgendaMedico): Promise<IAgendaMedico | null> {
        const { rows } = await db.query(
            `UPDATE "agenda_medico" SET id_medico = $1, id_consultorio = $2, dias_disponibles = $3, hora_inicio = $4, hora_fin = $5, creada_en = $6 WHERE id_agenda = $7 RETURNING id_agenda, id_medico, id_consultorio, dias_disponibles, hora_inicio, hora_fin, creada_en`,
            [datosAgenda.idMedico, datosAgenda.idConsultorio, datosAgenda.diasDisponibles, datosAgenda.horaInicio, datosAgenda.horaFin, new Date().toISOString(), idAgenda]
        );
        if (rows.length === 0) return null;
        return this.mapearAgenda(rows[0]);
    }

    async eliminarAgenda(idAgenda: string): Promise<void> {
        const { rowCount } = await db.query(
            `DELETE FROM "agenda_medico" WHERE id_agenda = $1`,
            [idAgenda]
        );
        if (rowCount === 0) {
            throw new Error("Agenda no encontrada");
        }
    }

    private mapearAgenda(row: Record<string, unknown>): IAgendaMedico {
        return {
            idAgenda: row.id_agenda as string,
            idMedico: row.id_medico as string,
            idConsultorio: row.id_consultorio as string,
            diasDisponibles: row.dias_disponibles as string[],
            horaInicio: row.hora_inicio as string,
            horaFin: row.hora_fin as string,
            creadaEn: row.creada_en as string,
        };
    }
}
