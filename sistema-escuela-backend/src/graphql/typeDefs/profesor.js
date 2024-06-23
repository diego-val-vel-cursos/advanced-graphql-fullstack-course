const { gql } = require('apollo-server');

const profesorTypeDefs = gql`
  type Profesor {
    id: ID!
    nombre: String!
    edad: Int!
    materia: String!
  }

  extend type Query {
    profesores: [Profesor]
    profesor(id: ID!): Profesor
  }

  extend type Mutation {
    crearProfesor(nombre: String!, edad: Int!, materia: String!): Profesor
    actualizarProfesor(id: ID!, nombre: String, edad: Int, materia: String): Profesor
    eliminarProfesor(id: ID!): String
  }
`;

module.exports = profesorTypeDefs;
