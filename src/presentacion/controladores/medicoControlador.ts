import { FastifyRequest, FastifyReply } from "fastify";
import { CrearMedico } from "../../core/aplicacion/medicoCasoUso/CrearMedico.js";
import { ListarMedicos } from "../../core/aplicacion/medicoCasoUso/ListarMedicos.js";
import { ObtenerMedicoPorId } from "../../core/aplicacion/medicoCasoUso/ObtenerMedicoPorId.js";
import { ActualizarMedico } from "../../core/aplicacion/medicoCasoUso/ActualizarMedico.js";
import { EliminarMedico } from "../../core/aplicacion/medicoCasoUso/EliminarMedico.js";
import { MedicoDTO, CrearMedicoEsquema } from "../../core/infraestructura/esquemas/MedicoEsquema.js";
import { MedicoRepositorio } from "../../core/infraestructura/repositorios/medicoRepositorio.js";
import { ZodError } from "zod";


const repo = new MedicoRepositorio();

const crearMedicoCaso = new CrearMedico(repo);
const listarMedicosCaso = new ListarMedicos(repo);
const obtenerMedicoPorIdCaso = new ObtenerMedicoPorId(repo);
const actualizarMedicoCaso = new ActualizarMedico(repo);
const eliminarMedicoCaso = new EliminarMedico(repo);


export async function crearMedicoControlador(
  req: FastifyRequest<{Body: MedicoDTO}>,
  reply: FastifyReply) {
  try {
    const datosMedico = CrearMedicoEsquema.parse(req.body);
    const idNuevoMedico = await crearMedicoCaso.ejecutar(datosMedico);

    return reply.code(201).send({
        mensaje: "Médico creado correctamente",
        idMedico: idNuevoMedico
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(400).send({
        mensaje: "Datos inválidos",
        error: err.issues[0]?.message || "Error desconocido",
      });
    }

    return reply.code(500).send({
      mensaje: "Error al crear el médico",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export async function listarMedicosControlador (
  req: FastifyRequest<{ Querystring: { limite?: number } }>,
  reply: FastifyReply) {
  try {
    const { limite } = req.query;
    const medicosEncontrados = await listarMedicosCaso.ejecutar(limite);

    return reply.code(200).send({
      mensaje: "Médicos encontrados correctamente",
      medicos: medicosEncontrados,
      medicosEncontrados: medicosEncontrados.length
    });
  } catch (err) {
    return reply.code(500).send({
      mensaje: "Error al obtener los médicos",
      error: err instanceof Error ? err.message : err
    });
  }
};

export async function obtenerMedicoPorIdControlador (
  req: FastifyRequest<{ Params: { idMedico: string } }>,
  reply: FastifyReply) {
    try {
      const { idMedico } = req.params;
      const medicoEncontrado = await obtenerMedicoPorIdCaso.ejecutar(idMedico);

      if (!medicoEncontrado) {
        return reply.code(404).send({
          mensaje: "Médico no encontrado"
        });
      }

      return reply.code(200).send({
        mensaje: "Médico encontrado correctamente",
        medico: medicoEncontrado
      });
    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al obtener el médico",
        error: err instanceof Error ? err.message: err
      });
    }
};

export async function actualizarMedicoControlador(
  req: FastifyRequest<{ Params: { idMedico: string }; Body: MedicoDTO }>,
  reply: FastifyReply){
    try{
      const { idMedico } = req.params;
      const nuevoMedico = CrearMedicoEsquema.parse(req.body);
      const medicoActualizado = await actualizarMedicoCaso.ejecutar(
        idMedico,
        nuevoMedico);

        if (!medicoActualizado) {
          reply.code(404).send({
            mensaje: "Médico no encontrado"
          });
        }

        return reply.code(200).send({
          mensaje: "Médico actualizado correctamente",
          medicoActualizado: medicoActualizado
        });

    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al actualizar el médico",
        error: err instanceof Error ? err.message : err
      });
    }
  };

  export async function eliminarMedicoControlador (
    req: FastifyRequest<{Params: {idMedico: string}}>,
    reply: FastifyReply) {
      try {
        const {idMedico} = req.params;
        await eliminarMedicoCaso.ejecutar(idMedico);

        return reply.code(200).send({
          mensaje: "Médico eliminado correctamente",
          idMedico: idMedico
        });
      } catch (err){
        return reply.code(500).send({
          mensaje: "Error al eliminar el médico",
          error: err instanceof Error ? err.message : err
        });
      }
    };
