import { IEspecialidad } from "../../dominio/entidades/especialidad/IEspecialidad.js";
import { IEspecialidadRepositorio } from "../../dominio/repository/IEspecialidadRepositorio.js";
import { db } from "../cliente-db/clientePostgres.js";
import { v4 as uuidv4 } from "uuid";

export class EspecialidadRepositorio implements IEspecialidadRepositorio {

    async crearEspecialidad(datosEspecialidad: IEspecialidad): Promise<string> {
        const id = uuidv4();
        const { rows } = await db.query(
            `INSERT INTO "especialidades" (id_especialidad, nombre, descripcion) VALUES ($1, $2, $3) RETURNING id_especialidad`,
            [id, datosEspecialidad.nombre, datosEspecialidad.descripcion ?? null]
        );
        return rows[0].id_especialidad;
    }

    async listarEspecialidades(limite?: number): Promise<IEspecialidad[]> {
        let query = `SELECT id_especialidad, nombre, descripcion FROM "especialidades" ORDER BY nombre`;
        const params: unknown[] = [];
        if (limite) {
            query += ` LIMIT $1`;
            params.push(limite);
        }
        const { rows } = await db.query(query, params);
        return rows.map(row => this.mapearEspecialidad(row));
    }

    async obtenerEspecialidadPorId(idEspecialidad: string): Promise<IEspecialidad | null> {
        const { rows } = await db.query(
            `SELECT id_especialidad, nombre, descripcion FROM "especialidades" WHERE id_especialidad = $1`,
            [idEspecialidad]
        );
        if (rows.length === 0) return null;
        return this.mapearEspecialidad(rows[0]);
    }

    async actualizarEspecialidad(idEspecialidad: string, datosEspecialidad: IEspecialidad): Promise<IEspecialidad> {
        const { rows } = await db.query(
            `UPDATE "especialidades" SET nombre = $1, descripcion = $2 WHERE id_especialidad = $3 RETURNING id_especialidad, nombre, descripcion`,
            [datosEspecialidad.nombre, datosEspecialidad.descripcion ?? null, idEspecialidad]
        );
        if (rows.length === 0) {
            throw new Error("Especialidad no encontrada");
        }
        return this.mapearEspecialidad(rows[0]);
    }

    async eliminarEspecialidad(idEspecialidad: string): Promise<void> {
        const { rowCount } = await db.query(
            `DELETE FROM "especialidades" WHERE id_especialidad = $1`,
            [idEspecialidad]
        );
        if (rowCount === 0) {
            throw new Error("Especialidad no encontrada");
        }
    }

    private mapearEspecialidad(row: Record<string, unknown>): IEspecialidad {
        return {
            idEspecialidad: row.id_especialidad as string,
            nombre: row.nombre as string,
            descripcion: (row.descripcion as string | null) ?? null,
        };
    }
}
