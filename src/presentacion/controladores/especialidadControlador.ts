import { FastifyRequest, FastifyReply } from "fastify";
import { CrearEspecialidad } from "../../core/aplicacion/especialidadCasoUso/CrearEspecialidad.js";
import { ListarEspecialidades } from "../../core/aplicacion/especialidadCasoUso/ListarEspecialidades.js";
import { ObtenerEspecialidadPorId } from "../../core/aplicacion/especialidadCasoUso/ObtenerEspecialidadPorId.js";
import { ActualizarEspecialidad } from "../../core/aplicacion/especialidadCasoUso/ActualizarEspecialidad.js";
import { EliminarEspecialidad } from "../../core/aplicacion/especialidadCasoUso/EliminarEspecialidad.js";
import { EspecialidadDTO, CrearEspecialidadEsquema } from "../../core/infraestructura/esquemas/EspecialidadEsquema.js";
import { EspecialidadRepositorio } from "../../core/infraestructura/repositorios/especialidadRepositorio.js";
import { ZodError } from "zod";


const repo = new EspecialidadRepositorio();

const crearEspecialidadCaso = new CrearEspecialidad(repo);
const listarEspecialidadesCaso = new ListarEspecialidades(repo);
const obtenerEspecialidadPorIdCaso = new ObtenerEspecialidadPorId(repo);
const actualizarEspecialidadCaso = new ActualizarEspecialidad(repo);
const eliminarEspecialidadCaso = new EliminarEspecialidad(repo);


export async function crearEspecialidadControlador(
  req: FastifyRequest<{Body: EspecialidadDTO}>,
  reply: FastifyReply) {
  try {
    const datosEspecialidad = CrearEspecialidadEsquema.parse(req.body);
    const idNuevaEspecialidad = await crearEspecialidadCaso.ejecutar(datosEspecialidad);

    return reply.code(201).send({
        mensaje: "Especialidad creada correctamente",
        idEspecialidad: idNuevaEspecialidad
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(400).send({
        mensaje: "Datos inválidos",
        error: err.issues[0]?.message || "Error desconocido",
      });
    }

    return reply.code(500).send({
      mensaje: "Error al crear la especialidad",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export async function listarEspecialidadesControlador (
  req: FastifyRequest<{ Querystring: { limite?: number } }>,
  reply: FastifyReply) {
  try {
    const { limite } = req.query;
    const especialidadesEncontradas = await listarEspecialidadesCaso.ejecutar(limite);

    return reply.code(200).send({
      mensaje: "Especialidades encontradas correctamente",
      especialidades: especialidadesEncontradas,
      especialidadesEncontradas: especialidadesEncontradas.length
    });
  } catch (err) {
    return reply.code(500).send({
      mensaje: "Error al obtener las especialidades",
      error: err instanceof Error ? err.message : err
    });
  }
};

export async function obtenerEspecialidadPorIdControlador (
  req: FastifyRequest<{ Params: { idEspecialidad: string } }>,
  reply: FastifyReply) {
    try {
      const { idEspecialidad } = req.params;
      const especialidadEncontrada = await obtenerEspecialidadPorIdCaso.ejecutar(idEspecialidad);

      if (!especialidadEncontrada) {
        return reply.code(404).send({
          mensaje: "Especialidad no encontrada"
        });
      }

      return reply.code(200).send({
        mensaje: "Especialidad encontrada correctamente",
        especialidad: especialidadEncontrada
      });
    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al obtener la especialidad",
        error: err instanceof Error ? err.message: err
      });
    }
};

export async function actualizarEspecialidadControlador(
  req: FastifyRequest<{ Params: { idEspecialidad: string }; Body: EspecialidadDTO }>,
  reply: FastifyReply){
    try{
      const { idEspecialidad } = req.params;
      const nuevaEspecialidad = CrearEspecialidadEsquema.parse(req.body);
      const especialidadActualizada = await actualizarEspecialidadCaso.ejecutar(
        idEspecialidad,
        nuevaEspecialidad);

        if (!especialidadActualizada) {
          reply.code(404).send({
            mensaje: "Especialidad no encontrada"
          });
        }

        return reply.code(200).send({
          mensaje: "Especialidad actualizada correctamente",
          especialidadActualizada: especialidadActualizada
        });

    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al actualizar la especialidad",
        error: err instanceof Error ? err.message : err
      });
    }
  };

  export async function eliminarEspecialidadControlador (
    req: FastifyRequest<{Params: {idEspecialidad: string}}>,
    reply: FastifyReply) {
      try {
        const {idEspecialidad} = req.params;
        await eliminarEspecialidadCaso.ejecutar(idEspecialidad);

        return reply.code(200).send({
          mensaje: "Especialidad eliminada correctamente",
          idEspecialidad: idEspecialidad
        });
      } catch (err){
        return reply.code(500).send({
          mensaje: "Error al eliminar la especialidad",
          error: err instanceof Error ? err.message : err
        });
      }
    };
