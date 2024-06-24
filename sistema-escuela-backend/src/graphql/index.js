const { gql } = require('apollo-server');
const alumnoTypeDefs = require('./typeDefs/alumno');
const profesorTypeDefs = require('./typeDefs/profesor');
const usuarioTypeDefs = require('./typeDefs/usuario');
const alumnoResolvers = require('./resolvers/alumno');
const profesorResolvers = require('./resolvers/profesor');
const usuarioResolvers = require('./resolvers/usuario');

const typeDefs = gql`
  type Query
  type Mutation
  ${alumnoTypeDefs}
  ${profesorTypeDefs}
  ${usuarioTypeDefs}
`;

const resolvers = {
  Query: {
    ...alumnoResolvers.Query,
    ...profesorResolvers.Query,
    ...usuarioResolvers.Query
  },
  Mutation: {
    ...alumnoResolvers.Mutation,
    ...profesorResolvers.Mutation,
    ...usuarioResolvers.Mutation
  }
};

module.exports = { typeDefs, resolvers };
