const { gql } = require('apollo-server');

const alumnoTypeDefs = gql`
  type Alumno {
    id: ID!
    nombre: String!
    edad: Int!
    curso: String!
  }

  extend type Query {
    alumnos: [Alumno]
    alumno(id: ID!): Alumno
  }

  extend type Mutation {
    crearAlumno(nombre: String!, edad: Int!, curso: String!): Alumno
    actualizarAlumno(id: ID!, nombre: String, edad: Int, curso: String): Alumno
    eliminarAlumno(id: ID!): String
  }
`;

module.exports = alumnoTypeDefs;
