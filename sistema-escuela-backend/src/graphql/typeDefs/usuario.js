const { gql } = require('apollo-server');

const usuarioTypeDefs = gql`
  type Usuario {
    id: ID!
    correo: String!
    password: String!
    rol: String!
    idUsuario: ID!
  }

  extend type Query {
    login(correo: String!, password: String!, rol: String!): Usuario
    usuarios: [Usuario]
    usuario(id: ID!): Usuario
  }

  extend type Mutation {
    crearUsuario(correo: String!, password: String!, rol: String!, idUsuario: ID!): Usuario
    actualizarUsuario(id: ID!, correo: String, password: String, rol: String, idUsuario: ID): Usuario
    eliminarUsuario(id: ID!): String
  }
`;

module.exports = usuarioTypeDefs;
