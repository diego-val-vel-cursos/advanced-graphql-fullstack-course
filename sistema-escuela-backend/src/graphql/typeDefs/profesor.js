const { gql } = require('apollo-server');

const profesorTypeDefs = gql`
  type Profesor {
    id: ID!
    nombre: String!
    edad: Int!
    materia: String!
  }

  extend type Query {
    profesor(id: ID!): Profesor
  }

  extend type Mutation {
    crearProfesor(nombre: String!, edad: Int!, materia: String!): Profesor
  }
`;

module.exports = profesorTypeDefs;
