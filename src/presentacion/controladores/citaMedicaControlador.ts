import { FastifyRequest, FastifyReply } from "fastify";
import { CrearCitaMedica } from "../../core/aplicacion/citaMedicaCasoUso/CrearCitaMedica.js";
import { ListarCitasMedicas } from "../../core/aplicacion/citaMedicaCasoUso/ListarCitasMedicas.js";
import { ObtenerCitaMedicaPorId } from "../../core/aplicacion/citaMedicaCasoUso/ObtenerCitaMedicaPorId.js";
import { ActualizarCitaMedica } from "../../core/aplicacion/citaMedicaCasoUso/ActualizarCitaMedica.js";
import { EliminarCitaMedica } from "../../core/aplicacion/citaMedicaCasoUso/EliminarCitaMedica.js";
import { CitaMedicaDTO, CrearCitaMedicaEsquema } from "../../core/infraestructura/esquemas/CitaMedicaEsquema.js";
import { CitaMedicaRepositorio } from "../../core/infraestructura/repositorios/citaMedicaRepositorio.js";
import { ZodError } from "zod";


const repo = new CitaMedicaRepositorio();

const crearCitaMedicaCaso = new CrearCitaMedica(repo);
const listarCitasMedicasCaso = new ListarCitasMedicas(repo);
const obtenerCitaMedicaPorIdCaso = new ObtenerCitaMedicaPorId(repo);
const actualizarCitaMedicaCaso = new ActualizarCitaMedica(repo);
const eliminarCitaMedicaCaso = new EliminarCitaMedica(repo);


export async function crearCitaMedicaControlador(
  req: FastifyRequest<{Body: CitaMedicaDTO}>,
  reply: FastifyReply) {
  try {
    const datosCitaMedica = CrearCitaMedicaEsquema.parse(req.body);
    const idNuevaCita = await crearCitaMedicaCaso.ejecutar(datosCitaMedica);

    return reply.code(201).send({
        mensaje: "Cita médica creada correctamente",
        idCita: idNuevaCita
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(400).send({
        mensaje: "Datos inválidos",
        error: err.issues[0]?.message || "Error desconocido",
      });
    }

    return reply.code(500).send({
      mensaje: "Error al crear la cita médica",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export async function listarCitasMedicasControlador (
  req: FastifyRequest<{ Querystring: { limite?: number } }>,
  reply: FastifyReply) {
  try {
    const { limite } = req.query;
    const citasEncontradas = await listarCitasMedicasCaso.ejecutar(limite);

    return reply.code(200).send({
      mensaje: "Citas médicas encontradas correctamente",
      citas: citasEncontradas,
      citasEncontradas: citasEncontradas.length
    });
  } catch (err) {
    return reply.code(500).send({
      mensaje: "Error al obtener las citas médicas",
      error: err instanceof Error ? err.message : err
    });
  }
};

export async function obtenerCitaMedicaPorIdControlador (
  req: FastifyRequest<{ Params: { idCita: string } }>,
  reply: FastifyReply) {
    try {
      const { idCita } = req.params;
      const citaEncontrada = await obtenerCitaMedicaPorIdCaso.ejecutar(idCita);

      if (!citaEncontrada) {
        return reply.code(404).send({
          mensaje: "Cita médica no encontrada"
        });
      }

      return reply.code(200).send({
        mensaje: "Cita médica encontrada correctamente",
        cita: citaEncontrada
      });
    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al obtener la cita médica",
        error: err instanceof Error ? err.message: err
      });
    }
};

export async function actualizarCitaMedicaControlador(
  req: FastifyRequest<{ Params: { idCita: string }; Body: CitaMedicaDTO }>,
  reply: FastifyReply){
    try{
      const { idCita } = req.params;
      const nuevaCitaMedica = CrearCitaMedicaEsquema.parse(req.body);
      const citaActualizada = await actualizarCitaMedicaCaso.ejecutar(
        idCita,
        nuevaCitaMedica);

        if (!citaActualizada) {
          reply.code(404).send({
            mensaje: "Cita médica no encontrada"
          });
        }

        return reply.code(200).send({
          mensaje: "Cita médica actualizada correctamente",
          citaActualizada: citaActualizada
        });

    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al actualizar la cita médica",
        error: err instanceof Error ? err.message : err
      });
    }
  };

  export async function eliminarCitaMedicaControlador (
    req: FastifyRequest<{Params: {idCita: string}}>,
    reply: FastifyReply) {
      try {
        const {idCita} = req.params;
        await eliminarCitaMedicaCaso.ejecutar(idCita);

        return reply.code(200).send({
          mensaje: "Cita médica eliminada correctamente",
          idCita: idCita
        });
      } catch (err){
        return reply.code(500).send({
          mensaje: "Error al eliminar la cita médica",
          error: err instanceof Error ? err.message : err
        });
      }
    };
