import { FastifyRequest, FastifyReply } from "fastify";
import { CrearPaciente } from "../../core/aplicacion/pacienteCasoUso/CrearPaciente.js";
import { ListarPacientes } from "../../core/aplicacion/pacienteCasoUso/ListarPacientes.js";
import { ObtenerPacientePorId } from "../../core/aplicacion/pacienteCasoUso/ObtenerPacientePorId.js";
import { ActualizarPaciente } from "../../core/aplicacion/pacienteCasoUso/ActualizarPaciente.js";
import { EliminarPaciente } from "../../core/aplicacion/pacienteCasoUso/EliminarPaciente.js";
import { PacienteDTO, CrearPacienteEsquema } from "../../core/infraestructura/esquemas/PacienteEsquema.js";
import { PacienteRepositorio } from "../../core/infraestructura/repositorios/pacienteRepositorio.js";
import { ZodError } from "zod";


const repo = new PacienteRepositorio();

const crearPacienteCaso = new CrearPaciente(repo);
const listarPacientesCaso = new ListarPacientes(repo);
const obtenerPacientePorIdCaso = new ObtenerPacientePorId(repo);
const actualizarPacienteCaso = new ActualizarPaciente(repo);
const eliminarPacienteCaso = new EliminarPaciente(repo);


export async function crearPacienteControlador(
  req: FastifyRequest<{Body: PacienteDTO}>,
  reply: FastifyReply) {
  try {
    const datosPaciente = CrearPacienteEsquema.parse(req.body);
    const idNuevoPaciente = await crearPacienteCaso.ejecutar(datosPaciente);
    
    return reply.code(201).send({
        mensaje: "Paciente creado correctamente",
        idPaciente: idNuevoPaciente
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.code(400).send({
        mensaje: "Datos inválidos",
        error: err.issues[0]?.message || "Error desconocido",
      });
    }

    return reply.code(500).send({
      mensaje: "Error al crear el paciente",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export async function listarPacienesControlador (
  req: FastifyRequest<{ Querystring: { limite?: number } }>, 
  reply: FastifyReply) {
  try {
    const { limite } = req.query;
    const pacientesEncontrados = await listarPacientesCaso.ejecutar(limite);

    return reply.code(200).send({
      mensaje: "Pacientes encontrados correctamente",
      pacientes: pacientesEncontrados,
      pacientesEncontrados: pacientesEncontrados.length
    });
  } catch (err) {
    return reply.code(500).send({
      mensaje: "Error al obtener los pacientes",
      error: err instanceof Error ? err.message : err
    });
  }
};

export async function obtenerPacientePorIdControlador (
  req: FastifyRequest<{ Params: { idPaciente: string } }>, 
  reply: FastifyReply) {
    try {
      const { idPaciente } = req.params;
      const pacienteEncontrado = await obtenerPacientePorIdCaso.ejecutar(idPaciente);

      if (!pacienteEncontrado) {
        return reply.code(404).send({
          mensaje: "Paciente no encontrado"
        });
      }

      return reply.code(200).send({
        mensaje: "Paciente encontrado correctamente",
        Paciente: pacienteEncontrado
      });
    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al obtener al paciente",
        error: err instanceof Error ? err.message: err
      });
    }
};

export async function actualizarPacienteControlador(
  req: FastifyRequest<{ Params: { idPaciente: string }; Body: PacienteDTO }>, 
  reply: FastifyReply){
    try{
      const { idPaciente} = req.params;
      const nuevoPaciente = CrearPacienteEsquema.parse(req.body);
      const pacienteActualizado = await actualizarPacienteCaso.ejecutar(
        idPaciente,
        nuevoPaciente);

        if (!pacienteActualizado) {
          reply.code(404).send({
            mensaje: "Paciente no encontrado"
          });
        }

        return reply.code(200).send({
          mensaje: "Paciente actualizado correctamente",
          pacienteActualizado: pacienteActualizado
        });

    } catch(err) {
      return reply.code(500).send({
        mensaje: "Error al actualizar el paciente",
        error: err instanceof Error ? err.message : err
      });
    }
  };

  export async function eliminarPacienteControlador (
    req: FastifyRequest<{Params: {idPaciente: string}}>,
    reply: FastifyReply) {
      try {
        const {idPaciente} = req.params;
        await eliminarPacienteCaso.ejecutar(idPaciente);

        return reply.code(200).send({
          mensaje: "Paciente eliminado correctamente",
          idPaciente: idPaciente
        });
      } catch (err){
        return reply.code(500).send({
          mensaje: "Error al eliminar el paciente",
          error: err instanceof Error ? err.message : err
        });
      }
    };
