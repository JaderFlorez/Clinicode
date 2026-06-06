import { IConsultorio } from "../../dominio/entidades/consultorio/IConsultorio.js";
import { IConsultorioRepositorio } from "../../dominio/repository/IConsultorioRepositorio.js";
import { db } from "../cliente-db/clientePostgres.js";
import { v4 as uuidv4 } from "uuid";

export class ConsultorioRepositorio implements IConsultorioRepositorio {

    async crearConsultorio(datosConsultorio: IConsultorio): Promise<string> {
        const id = uuidv4();
        const { rows } = await db.query(
            `INSERT INTO "consultorios" (id_consultorio, nombre, ubicacion, disponible) VALUES ($1, $2, $3, $4) RETURNING id_consultorio`,
            [id, datosConsultorio.nombre, datosConsultorio.ubicacion ?? null, datosConsultorio.disponible ?? true]
        );
        return rows[0].id_consultorio;
    }

    async listarConsultorios(limite?: number): Promise<IConsultorio[]> {
        let query = `SELECT id_consultorio, nombre, ubicacion, disponible FROM "consultorios" ORDER BY nombre`;
        const params: unknown[] = [];
        if (limite) {
            query += ` LIMIT $1`;
            params.push(limite);
        }
        const { rows } = await db.query(query, params);
        return rows.map(row => this.mapearConsultorio(row));
    }

    async obtenerConsultorioPorId(idConsultorio: string): Promise<IConsultorio | null> {
        const { rows } = await db.query(
            `SELECT id_consultorio, nombre, ubicacion, disponible FROM "consultorios" WHERE id_consultorio = $1`,
            [idConsultorio]
        );
        if (rows.length === 0) return null;
        return this.mapearConsultorio(rows[0]);
    }

    async actualizarConsultorio(idConsultorio: string, datosConsultorio: IConsultorio): Promise<IConsultorio> {
        const { rows } = await db.query(
            `UPDATE "consultorios" SET nombre = $1, ubicacion = $2, disponible = $3 WHERE id_consultorio = $4 RETURNING id_consultorio, nombre, ubicacion, disponible`,
            [datosConsultorio.nombre, datosConsultorio.ubicacion ?? null, datosConsultorio.disponible ?? true, idConsultorio]
        );
        if (rows.length === 0) {
            throw new Error("Consultorio no encontrado");
        }
        return this.mapearConsultorio(rows[0]);
    }

    async eliminarConsultorio(idConsultorio: string): Promise<void> {
        const { rowCount } = await db.query(
            `DELETE FROM "consultorios" WHERE id_consultorio = $1`,
            [idConsultorio]
        );
        if (rowCount === 0) {
            throw new Error("Consultorio no encontrado");
        }
    }

    private mapearConsultorio(row: Record<string, unknown>): IConsultorio {
        return {
            idConsultorio: row.id_consultorio as string,
            nombre: row.nombre as string,
            ubicacion: (row.ubicacion as string | null) ?? null,
            disponible: row.disponible as boolean,
        };
    }
}
