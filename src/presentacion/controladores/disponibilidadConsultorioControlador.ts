import { FastifyRequest, FastifyReply } from "fastify";
import { CrearDisponibilidadConsultorio } from "../../core/aplicacion/disponibilidadConsultorioCasoUso/CrearDisponibilidadConsultorio.js";
import { ListarDisponibilidadesConsultorio } from "../../core/aplicacion/disponibilidadConsultorioCasoUso/ListarDisponibilidadesConsultorio.js";
import { ObtenerDisponibilidadConsultorioPorId } from "../../core/aplicacion/disponibilidadConsultorioCasoUso/ObtenerDisponibilidadConsultorioPorId.js";
import { ActualizarDisponibilidadConsultorio } from "../../core/aplicacion/disponibilidadConsultorioCasoUso/ActualizarDisponibilidadConsultorio.js";
import { EliminarDisponibilidadConsultorio } from "../../core/aplicacion/disponibilidadConsultorioCasoUso/EliminarDisponibilidadConsultorio.js";
import { DisponibilidadConsultorioDTO, CrearDisponibilidadConsultorioEsquema } from "../../core/infraestructura/esquemas/DisponibilidadConsultorioEsquema.js";
import { DisponibilidadConsultorioRepositorio } from "../../core/infraestructura/repositorios/disponibilidadConsultorioRepositorio.js";
import { ZodError } from "zod";


const repo = new DisponibilidadConsultorioRepositorio();

const crearDisponibilidadCaso = new CrearDisponibilidadConsultorio(repo);
const listarDisponibilidadesCaso = new ListarDisponibilidadesConsultorio(repo);
const obtenerDisponibilidadPorIdCaso = new ObtenerDisponibilidadConsultorioPorId(repo);
const actualizarDisponibilidadCaso = new ActualizarDisponibilidadConsultorio(repo);
const eliminarDisponibilidadCaso = new EliminarDisponibilidadConsultorio(repo);


export async function crearDisponibilidadConsultorioControlador(
  req: FastifyRequest<{Body: DisponibilidadConsultorioDTO}>,
  reply: FastifyReply) {
  try {
    const datosDisponibilidad = CrearDisponibilidadConsultorioEsquema.parse(req.body);
    const idNuevaDisponibilidad = await crearDisponibilidadCaso.ejecutar(datosDisponibilidad);

    return reply.code(201).send({
        mensaje: "Disponibilidad de consultorio creada correctamente",
        idDisponibilidad: idNuevaDisponibilidad
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(400).send({
        mensaje: "Datos inválidos",
        error: err.issues[0]?.message || "Error desconocido",
      });
    }

    return reply.code(500).send({
      mensaje: "Error al crear la disponibilidad del consultorio",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export async function listarDisponibilidadesConsultorioControlador (
  req: FastifyRequest<{ Querystring: { limite?: number } }>,
  reply: FastifyReply) {
  try {
    const { limite } = req.query;
    const disponibilidadesEncontradas = await listarDisponibilidadesCaso.ejecutar(limite);

    return reply.code(200).send({
      mensaje: "Disponibilidades de consultorio encontradas correctamente",
      disponibilidades: disponibilidadesEncontradas,
      disponibilidadesEncontradas: disponibilidadesEncontradas.length
    });
  } catch (err) {
    return reply.code(500).send({
      mensaje: "Error al obtener las disponibilidades del consultorio",
      error: err instanceof Error ? err.message : err
    });
  }
};

export async function obtenerDisponibilidadConsultorioPorIdControlador (
  req: FastifyRequest<{ Params: { idDisponibilidad: string } }>,
  reply: FastifyReply) {
    try {
      const { idDisponibilidad } = req.params;
      const disponibilidadEncontrada = await obtenerDisponibilidadPorIdCaso.ejecutar(idDisponibilidad);

      if (!disponibilidadEncontrada) {
        return reply.code(404).send({
          mensaje: "Disponibilidad de consultorio no encontrada"
        });
      }

      return reply.code(200).send({
        mensaje: "Disponibilidad de consultorio encontrada correctamente",
        disponibilidad: disponibilidadEncontrada
      });
    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al obtener la disponibilidad del consultorio",
        error: err instanceof Error ? err.message: err
      });
    }
};

export async function actualizarDisponibilidadConsultorioControlador(
  req: FastifyRequest<{ Params: { idDisponibilidad: string }; Body: DisponibilidadConsultorioDTO }>,
  reply: FastifyReply){
    try{
      const { idDisponibilidad } = req.params;
      const nuevaDisponibilidad = CrearDisponibilidadConsultorioEsquema.parse(req.body);
      const disponibilidadActualizada = await actualizarDisponibilidadCaso.ejecutar(
        idDisponibilidad,
        nuevaDisponibilidad);

        if (!disponibilidadActualizada) {
          reply.code(404).send({
            mensaje: "Disponibilidad de consultorio no encontrada"
          });
        }

        return reply.code(200).send({
          mensaje: "Disponibilidad de consultorio actualizada correctamente",
          disponibilidadActualizada: disponibilidadActualizada
        });

    } catch(err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Datos inválidos",
          error: err.issues[0]?.message || "Error de validación",
        });
      }
      return reply.code(500).send({
        mensaje: "Error al actualizar la disponibilidad del consultorio",
        error: err instanceof Error ? err.message : err
      });
    }
  };

  export async function eliminarDisponibilidadConsultorioControlador (
    req: FastifyRequest<{Params: {idDisponibilidad: string}}>,
    reply: FastifyReply) {
      try {
        const {idDisponibilidad} = req.params;
        await eliminarDisponibilidadCaso.ejecutar(idDisponibilidad);

        return reply.code(200).send({
          mensaje: "Disponibilidad de consultorio eliminada correctamente",
          idDisponibilidad: idDisponibilidad
        });
      } catch (err){
        return reply.code(500).send({
          mensaje: "Error al eliminar la disponibilidad del consultorio",
          error: err instanceof Error ? err.message : err
        });
      }
    };
