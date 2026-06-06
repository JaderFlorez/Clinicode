
import { FastifyRequest, FastifyReply } from "fastify";
import { CrearConsultorio } from "../../core/aplicacion/consultorioCasoUso/CrearConsultorio.js";
import { ListarConsultorios } from "../../core/aplicacion/consultorioCasoUso/ListarConsultorios.js";
import { ObtenerConsultorioPorId } from "../../core/aplicacion/consultorioCasoUso/ObtenerConsultorioPorId.js";
import { ActualizarConsultorio } from "../../core/aplicacion/consultorioCasoUso/ActualizarConsultorio.js";
import { EliminarConsultorio } from "../../core/aplicacion/consultorioCasoUso/EliminarConsultorio.js";
import { ConsultorioDTO, CrearConsultorioEsquema } from "../../core/infraestructura/esquemas/ConsultorioEsquema.js";
import { ConsultorioRepositorio } from "../../core/infraestructura/repositorios/consultorioRepositorio.js";
import { ZodError } from "zod";


const repo = new ConsultorioRepositorio();

const crearConsultorioCaso = new CrearConsultorio(repo);
const listarConsultoriosCaso = new ListarConsultorios(repo);
const obtenerConsultorioPorIdCaso = new ObtenerConsultorioPorId(repo);
const actualizarConsultorioCaso = new ActualizarConsultorio(repo);
const eliminarConsultorioCaso = new EliminarConsultorio(repo);


export async function crearConsultorioControlador(
  req: FastifyRequest<{Body: ConsultorioDTO}>,
  reply: FastifyReply) {
  try {
    const datosConsultorio = CrearConsultorioEsquema.parse(req.body);
    const idNuevoConsultorio = await crearConsultorioCaso.ejecutar(datosConsultorio);

    return reply.code(201).send({
        mensaje: "Consultorio creado correctamente",
        idConsultorio: idNuevoConsultorio
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(400).send({
        mensaje: "Datos inválidos",
        error: err.issues[0]?.message || "Error desconocido",
      });
    }

    return reply.code(500).send({
      mensaje: "Error al crear el consultorio",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export async function listarConsultoriosControlador (
  req: FastifyRequest<{ Querystring: { limite?: number } }>,
  reply: FastifyReply) {
  try {
    const { limite } = req.query;
    const consultoriosEncontrados = await listarConsultoriosCaso.ejecutar(limite);

    return reply.code(200).send({
      mensaje: "Consultorios encontrados correctamente",
      consultorios: consultoriosEncontrados,
      consultoriosEncontrados: consultoriosEncontrados.length
    });
  } catch (err) {
    return reply.code(500).send({
      mensaje: "Error al obtener los consultorios",
      error: err instanceof Error ? err.message : err
    });
  }
};

export async function obtenerConsultorioPorIdControlador (
  req: FastifyRequest<{ Params: { idConsultorio: string } }>,
  reply: FastifyReply) {
    try {
      const { idConsultorio } = req.params;
      const consultorioEncontrado = await obtenerConsultorioPorIdCaso.ejecutar(idConsultorio);

      if (!consultorioEncontrado) {
        return reply.code(404).send({
          mensaje: "Consultorio no encontrado"
        });
      }

      return reply.code(200).send({
        mensaje: "Consultorio encontrado correctamente",
        consultorio: consultorioEncontrado
      });
    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al obtener el consultorio",
        error: err instanceof Error ? err.message: err
      });
    }
};

export async function actualizarConsultorioControlador(
  req: FastifyRequest<{ Params: { idConsultorio: string }; Body: ConsultorioDTO }>,
  reply: FastifyReply){
    try{
      const { idConsultorio } = req.params;
      const nuevoConsultorio = CrearConsultorioEsquema.parse(req.body);
      const consultorioActualizado = await actualizarConsultorioCaso.ejecutar(
        idConsultorio,
        nuevoConsultorio);

        if (!consultorioActualizado) {
          reply.code(404).send({
            mensaje: "Consultorio no encontrado"
          });
        }

        return reply.code(200).send({
          mensaje: "Consultorio actualizado correctamente",
          consultorioActualizado: consultorioActualizado
        });

    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al actualizar el consultorio",
        error: err instanceof Error ? err.message : err
      });
    }
  };

  export async function eliminarConsultorioControlador (
    req: FastifyRequest<{Params: {idConsultorio: string}}>,
    reply: FastifyReply) {
      try {
        const {idConsultorio} = req.params;
        await eliminarConsultorioCaso.ejecutar(idConsultorio);

        return reply.code(200).send({
          mensaje: "Consultorio eliminado correctamente",
          idConsultorio: idConsultorio
        });
      } catch (err){
        return reply.code(500).send({
          mensaje: "Error al eliminar el consultorio",
          error: err instanceof Error ? err.message : err
        });
      }
    };

