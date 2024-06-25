const { gql } = require('apollo-server');

const grupoTypeDefs = gql`
  type Grupo {
    id: ID!
    nombre: String!
    grado: Grado!
  }

  extend type Query {
    grupos: [Grupo]
    grupo(id: ID!): Grupo
  }

  extend type Mutation {
    crearGrupo(nombre: String!, grado_id: ID!): Grupo
    actualizarGrupo(id: ID!, nombre: String, grado_id: ID): Grupo
    eliminarGrupo(id: ID!): String
  }
`;

module.exports = grupoTypeDefs;
