import { FastifyRequest, FastifyReply } from "fastify";
import { CrearAgendaMedico } from "../../core/aplicacion/agendaMedicoCasoUso/CrearAgenda.js";
import { ListarAgendaMedico } from "../../core/aplicacion/agendaMedicoCasoUso/ListarAgendaMedico.js";
import { ObtenerAgendaPorId } from "../../core/aplicacion/agendaMedicoCasoUso/ObtenerAgendaMedicoPorId.js";
import { ActualizarAgenda } from "../../core/aplicacion/agendaMedicoCasoUso/ActualizarAgenda.js";
import { EliminarAgenda } from "../../core/aplicacion/agendaMedicoCasoUso/EliminarAgenda.js";
import { AgendaMedicoDTO, CrearAgendaMedicoEsquema } from "../../core/infraestructura/esquemas/AgendaMedicoEsquema.js";
import { AgendaMedicoRepositorio } from "../../core/infraestructura/repositorios/agendaMedicoRepositorio.js";
import { ZodError } from "zod";

const repo = new AgendaMedicoRepositorio();

const crearAgendaMedicoCaso = new CrearAgendaMedico(repo);
const listarAgendaMedicoCaso = new ListarAgendaMedico(repo);
const obtenerAgendaPorIdCaso = new ObtenerAgendaPorId(repo);
const actualizarAgendaCaso = new ActualizarAgenda(repo);
const eliminarAgendaCaso = new EliminarAgenda(repo);

export async function crearAgendaMedicoControlador (
    req: FastifyRequest<{Body:AgendaMedicoDTO}>,
    reply: FastifyReply) {
        try{
            const datosAgenda = CrearAgendaMedicoEsquema.parse(req.body);
            const idNuevaAgenda = await crearAgendaMedicoCaso.ejecutar(datosAgenda);

            return reply.code(200).send({
                mensaje: "Agendamiento del médico creado correctamente",
                idAgenda: idNuevaAgenda
            });
        } catch (err) {
            if (err instanceof ZodError) {
                return reply.code(400).send({
                    mensaje: "Datos inválidos",
                    error: err.issues[0]?.message || "Error desconocido",
                });
            }
            return reply.code(500).send({
                mensaje: "Error al crear agenda del médico",
                error: err instanceof Error ? err.message : String(err)
            });
        }
    };

export async function listarAgendaMedicoControlador (
    req: FastifyRequest<{Querystring: {limite?: number}}>,
    reply: FastifyReply) {
        try{
            const {limite} = req.query;
            const agendaMedicoEncontrada = await listarAgendaMedicoCaso.ejecutar(limite);

            return reply.code(200).send({
                mensaje: "Agendas de médicos encontradas correctamente",
                AgendaMedico: agendaMedicoEncontrada,
                TotalAgendamientos: agendaMedicoEncontrada.length
            });
        } catch(err){
            return reply.code(500).send({
                mensaje: "Error al obtener las agendas de los médicos",
                error: err instanceof Error ? err.message : err
            });
        }
    };

export async function obtenerAgendaPorIdControlador (
    req: FastifyRequest<{ Params: { idAgenda: string } }>, 
    reply: FastifyReply) {
        try {
            const { idAgenda } = req.params;
            const agendaEncontrada = await obtenerAgendaPorIdCaso.ejecutar(idAgenda);
            
            if (!agendaEncontrada) {
                return reply.code(404).send({
                    mensaje: "Agenda del médico no encontrada"
                });
            }
            
            return reply.code(200).send({
                mensaje: "Agenda del médico encontrada correctamente",
                AgendaMédico: agendaEncontrada
            });
        } catch(err) {
            return reply.code(500).send({
                mensaje: "Error al obtener la agenda del médico",
                error: err instanceof Error ? err.message: err
            });
        }
    };

export async function actualizarAgendaMedicoControlador(
    req: FastifyRequest<{ Params: { idAgenda: string }; Body: AgendaMedicoDTO }>, 
    reply: FastifyReply){
        try{
            const { idAgenda} = req.params;
            const nuevaAgenda = CrearAgendaMedicoEsquema.parse(req.body);
            const agendaActualizada = await actualizarAgendaCaso.ejecutar(
        idAgenda,
        nuevaAgenda);

        if (!agendaActualizada) {
            reply.code(404).send({
            mensaje: "Agenda del médico no encontrada"
        });
        }
        
        return reply.code(200).send({
            mensaje: "Agenda del médico actualizada correctamente",
            AgendaActualizada: agendaActualizada
        });
    } catch(err) {
        if (err instanceof ZodError) {
            return reply.code(400).send({
                mensaje: "Datos inválidos",
                error: err.issues[0]?.message || "Error de validación",
            });
        }
        return reply.code(500).send({
        mensaje: "Error al actualizar la agenda del médico",
        error: err instanceof Error ? err.message : err
    });
    }
};

export async function eliminarAgendaControlador (
    req: FastifyRequest<{Params: {idAgenda: string}}>,
    reply: FastifyReply) {
        try {
            const {idAgenda} = req.params;
            await eliminarAgendaCaso.ejecutar(idAgenda);
            
            return reply.code(200).send({
                mensaje: "Agenda del médico eliminada correctamente",
                idAgenda: idAgenda
            });
        } catch (err){
            return reply.code(500).send({
                mensaje: "Error al eliminar la agenda del médico",
                error: err instanceof Error ? err.message : err
            });
        }
    };