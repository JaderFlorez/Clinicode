import { IDisponibilidadConsultorio } from "../../dominio/entidades/disponibilidadConsultorio/IDisponibilidadConsultorio.js";
import { IDisponibilidadConsultorioRepositorio } from "../../dominio/repository/IDisponibilidadConsultorioRepositorio.js";
import { db } from "../cliente-db/clientePostgres.js";
import { v4 as uuidv4 } from "uuid";

export class DisponibilidadConsultorioRepositorio implements IDisponibilidadConsultorioRepositorio {

    async crearDisponibilidad(datosDisponibilidad: IDisponibilidadConsultorio): Promise<string> {
        const id = uuidv4();
        const { rows } = await db.query(
            `INSERT INTO "disponibilidad_consultorio" (id_disponibilidad, id_consultorio, dia_semana, hora_inicio, hora_fin, disponible) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_disponibilidad`,
            [id, datosDisponibilidad.idConsultorio, datosDisponibilidad.diaSemana, datosDisponibilidad.horaInicio, datosDisponibilidad.horaFin, datosDisponibilidad.disponible ?? true]
        );
        return rows[0].id_disponibilidad;
    }

    async listarDisponibilidades(limite?: number): Promise<IDisponibilidadConsultorio[]> {
        let query = `SELECT id_disponibilidad, id_consultorio, dia_semana, hora_inicio, hora_fin, disponible FROM "disponibilidad_consultorio" ORDER BY dia_semana, hora_inicio`;
        const params: unknown[] = [];
        if (limite) {
            query += ` LIMIT $1`;
            params.push(limite);
        }
        const { rows } = await db.query(query, params);
        return rows.map(row => this.mapearDisponibilidad(row));
    }

    async obtenerDisponibilidadPorId(idDisponibilidad: string): Promise<IDisponibilidadConsultorio | null> {
        const { rows } = await db.query(
            `SELECT id_disponibilidad, id_consultorio, dia_semana, hora_inicio, hora_fin, disponible FROM "disponibilidad_consultorio" WHERE id_disponibilidad = $1`,
            [idDisponibilidad]
        );
        if (rows.length === 0) return null;
        return this.mapearDisponibilidad(rows[0]);
    }

    async actualizarDisponibilidad(idDisponibilidad: string, datosDisponibilidad: IDisponibilidadConsultorio): Promise<IDisponibilidadConsultorio> {
        const { rows } = await db.query(
            `UPDATE "disponibilidad_consultorio" SET id_consultorio = $1, dia_semana = $2, hora_inicio = $3, hora_fin = $4, disponible = $5 WHERE id_disponibilidad = $6 RETURNING id_disponibilidad, id_consultorio, dia_semana, hora_inicio, hora_fin, disponible`,
            [datosDisponibilidad.idConsultorio, datosDisponibilidad.diaSemana, datosDisponibilidad.horaInicio, datosDisponibilidad.horaFin, datosDisponibilidad.disponible ?? true, idDisponibilidad]
        );
        if (rows.length === 0) {
            throw new Error("Disponibilidad no encontrada");
        }
        return this.mapearDisponibilidad(rows[0]);
    }

    async eliminarDisponibilidad(idDisponibilidad: string): Promise<void> {
        const { rowCount } = await db.query(
            `DELETE FROM "disponibilidad_consultorio" WHERE id_disponibilidad = $1`,
            [idDisponibilidad]
        );
        if (rowCount === 0) {
            throw new Error("Disponibilidad no encontrada");
        }
    }

    private mapearDisponibilidad(row: Record<string, unknown>): IDisponibilidadConsultorio {
        return {
            idDisponibilidad: row.id_disponibilidad as string,
            idConsultorio: row.id_consultorio as string,
            diaSemana: row.dia_semana as string,
            horaInicio: row.hora_inicio as string,
            horaFin: row.hora_fin as string,
            disponible: row.disponible as boolean,
        };
    }
}
