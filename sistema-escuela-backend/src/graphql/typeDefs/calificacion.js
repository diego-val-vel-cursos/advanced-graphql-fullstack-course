const { gql } = require('apollo-server');

const calificacionTypeDefs = gql`
  type Calificacion {
    id: ID!
    nota: Float!
    comentarios: String
    alumno: Alumno!
    materia: Materia!
    profesor: Profesor!
  }

  extend type Query {
    calificaciones(limit: Int, offset: Int): [Calificacion]
    calificacion(id: ID!): Calificacion
  }

  extend type Mutation {
    crearCalificacion(nota: Float!, comentarios: String, alumno_id: ID!, materia_id: ID!, profesor_id: ID!): Calificacion
    actualizarCalificacion(id: ID!, nota: Float, comentarios: String, alumno_id: ID, materia_id: ID, profesor_id: ID): Calificacion
    eliminarCalificacion(id: ID!): String
  }
`;

module.exports = calificacionTypeDefs;
