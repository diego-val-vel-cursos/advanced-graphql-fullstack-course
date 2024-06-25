const { gql } = require('apollo-server');

const materiaTypeDefs = gql`
  type Materia {
    id: ID!
    nombre: String!
    tipo: String!
  }

  extend type Query {
    materias: [Materia]
    materia(id: ID!): Materia
  }

  extend type Mutation {
    crearMateria(nombre: String!, tipo: String!): Materia
    actualizarMateria(id: ID!, nombre: String, tipo: String): Materia
    eliminarMateria(id: ID!): String
  }
`;

module.exports = materiaTypeDefs;
