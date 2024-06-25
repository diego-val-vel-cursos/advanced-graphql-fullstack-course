const { gql } = require('apollo-server');

const gradoTypeDefs = gql`
  type Grado {
    id: ID!
    numero: Int!
  }

  extend type Query {
    grados: [Grado]
    grado(id: ID!): Grado
  }

  extend type Mutation {
    crearGrado(numero: Int!): Grado
    actualizarGrado(id: ID!, numero: Int): Grado
    eliminarGrado(id: ID!): String
  }
`;

module.exports = gradoTypeDefs;
