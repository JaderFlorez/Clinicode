import { IMedico } from "../../dominio/entidades/medico/IMedico.js";
import { IMedicoRepositorio } from "../../dominio/repository/IMedicoRepositorio.js";
import { db } from "../cliente-db/clientePostgres.js";
import { v4 as uuidv4 } from "uuid";

export class MedicoRepositorio implements IMedicoRepositorio {

    async crearMedico(datosMedico: IMedico): Promise<string> {
        const id = uuidv4();
        const { rows } = await db.query(
            `INSERT INTO "medicos" (id_medico, nombres, apellidos, numero_licencia, id_especialidad, telefono, correo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_medico`,
            [id, datosMedico.nombres, datosMedico.apellidos, datosMedico.numeroLicencia, datosMedico.idEspecialidad, datosMedico.telefono ?? null, datosMedico.correo ?? null]
        );
        return rows[0].id_medico;
    }

    async listarMedicos(limite?: number): Promise<IMedico[]> {
        let query = `SELECT id_medico, nombres, apellidos, numero_licencia, id_especialidad, telefono, correo FROM "medicos" ORDER BY nombres, apellidos`;
        const params: unknown[] = [];
        if (limite) {
            query += ` LIMIT $1`;
            params.push(limite);
        }
        const { rows } = await db.query(query, params);
        return rows.map(row => this.mapearMedico(row));
    }

    async obtenerMedicoPorId(idMedico: string): Promise<IMedico | null> {
        const { rows } = await db.query(
            `SELECT id_medico, nombres, apellidos, numero_licencia, id_especialidad, telefono, correo FROM "medicos" WHERE id_medico = $1`,
            [idMedico]
        );
        if (rows.length === 0) return null;
        return this.mapearMedico(rows[0]);
    }

    async actualizarMedico(idMedico: string, datosMedico: IMedico): Promise<IMedico> {
        const { rows } = await db.query(
            `UPDATE "medicos" SET nombres = $1, apellidos = $2, numero_licencia = $3, id_especialidad = $4, telefono = $5, correo = $6 WHERE id_medico = $7 RETURNING id_medico, nombres, apellidos, numero_licencia, id_especialidad, telefono, correo`,
            [datosMedico.nombres, datosMedico.apellidos, datosMedico.numeroLicencia, datosMedico.idEspecialidad, datosMedico.telefono ?? null, datosMedico.correo ?? null, idMedico]
        );
        if (rows.length === 0) {
            throw new Error("Médico no encontrado");
        }
        return this.mapearMedico(rows[0]);
    }

    async eliminarMedico(idMedico: string): Promise<void> {
        const { rowCount } = await db.query(
            `DELETE FROM "medicos" WHERE id_medico = $1`,
            [idMedico]
        );
        if (rowCount === 0) {
            throw new Error("Médico no encontrado");
        }
    }

    private mapearMedico(row: Record<string, unknown>): IMedico {
        return {
            idMedico: row.id_medico as string,
            nombres: row.nombres as string,
            apellidos: row.apellidos as string,
            numeroLicencia: row.numero_licencia as string,
            idEspecialidad: row.id_especialidad as string,
            telefono: (row.telefono as string | null) ?? null,
            correo: (row.correo as string | null) ?? null,
        };
    }
}
