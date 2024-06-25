const { gql } = require('apollo-server');

const alumnoTypeDefs = gql`
  type Alumno {
    id: ID!
    nombre: String!
    edad: Int!
    grupo: Grupo!
  }

  extend type Query {
    alumnos: [Alumno]
    alumno(id: ID!): Alumno
  }

  extend type Mutation {
    crearAlumno(nombre: String!, edad: Int!, grupo_id: ID!): Alumno
    actualizarAlumno(id: ID!, nombre: String, edad: Int, grupo_id: ID): Alumno
    eliminarAlumno(id: ID!): String
  }
`;

module.exports = alumnoTypeDefs;
