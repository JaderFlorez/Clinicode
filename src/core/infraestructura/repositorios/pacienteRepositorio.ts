import { IPacienteRepositorio } from "../../dominio/repository/IPacienteRepositorio.js";
import { IPaciente } from "../../dominio/entidades/pacientes/Ipaciente.js";
import { db } from "../cliente-db/clientePostgres.js";
import { v4 as uuidv4 } from "uuid";

export class PacienteRepositorio implements IPacienteRepositorio {

    async crearPaciente(datosPaciente: IPaciente): Promise<string> {
        const id = uuidv4();
        const { rows } = await db.query(
            `INSERT INTO "pacientes" (id_paciente, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, telefono, correo, direccion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_paciente`,
            [id, datosPaciente.tipoDocumento, datosPaciente.numeroDocumento, datosPaciente.nombres, datosPaciente.apellidos, datosPaciente.fechaNacimiento, datosPaciente.telefono, datosPaciente.correo ?? null, datosPaciente.direccion]
        );
        return rows[0].id_paciente;
    }

    async listarPacientes(limite?: number): Promise<IPaciente[]> {
        let query = `SELECT id_paciente, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, telefono, correo, direccion FROM "pacientes" ORDER BY nombres, apellidos`;
        const params: unknown[] = [];
        if (limite) {
            query += ` LIMIT $1`;
            params.push(limite);
        }
        const { rows } = await db.query(query, params);
        return rows.map(row => this.mapearPaciente(row));
    }

    async obtenerPacientePorId(idPaciente: string): Promise<IPaciente | null> {
        const { rows } = await db.query(
            `SELECT id_paciente, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, telefono, correo, direccion FROM "pacientes" WHERE id_paciente = $1`,
            [idPaciente]
        );
        if (rows.length === 0) return null;
        return this.mapearPaciente(rows[0]);
    }

    async actualizarPaciente(idPaciente: string, datosPaciente: IPaciente): Promise<IPaciente> {
        const { rows } = await db.query(
            `UPDATE "pacientes" SET tipo_documento = $1, numero_documento = $2, nombres = $3, apellidos = $4, fecha_nacimiento = $5, telefono = $6, correo = $7, direccion = $8 WHERE id_paciente = $9 RETURNING id_paciente, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, telefono, correo, direccion`,
            [datosPaciente.tipoDocumento, datosPaciente.numeroDocumento, datosPaciente.nombres, datosPaciente.apellidos, datosPaciente.fechaNacimiento, datosPaciente.telefono, datosPaciente.correo ?? null, datosPaciente.direccion, idPaciente]
        );
        if (rows.length === 0) {
            throw new Error("Paciente no encontrado");
        }
        return this.mapearPaciente(rows[0]);
    }

    async eliminarPaciente(idPaciente: string): Promise<void> {
        const { rowCount } = await db.query(
            `DELETE FROM "pacientes" WHERE id_paciente = $1`,
            [idPaciente]
        );
        if (rowCount === 0) {
            throw new Error("Paciente no encontrado");
        }
    }

    private mapearPaciente(row: Record<string, unknown>): IPaciente {
        return {
            idPaciente: row.id_paciente as string,
            tipoDocumento: row.tipo_documento as string,
            numeroDocumento: row.numero_documento as string,
            nombres: row.nombres as string,
            apellidos: row.apellidos as string,
            fechaNacimiento: row.fecha_nacimiento as Date,
            telefono: row.telefono as string,
            correo: (row.correo as string | null) ?? null,
            direccion: row.direccion as string,
        };
    }
}
