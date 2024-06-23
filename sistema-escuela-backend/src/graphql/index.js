const { gql } = require('apollo-server');
const alumnoTypeDefs = require('./typeDefs/alumno');
const profesorTypeDefs = require('./typeDefs/profesor');
const alumnoResolvers = require('./resolvers/alumno');
const profesorResolvers = require('./resolvers/profesor');

const typeDefs = gql`
  type Query
  type Mutation
  ${alumnoTypeDefs}
  ${profesorTypeDefs}
`;

const resolvers = {
  Query: {
    ...alumnoResolvers.Query,
    ...profesorResolvers.Query
  },
  Mutation: {
    ...alumnoResolvers.Mutation,
    ...profesorResolvers.Mutation
  }
};

module.exports = { typeDefs, resolvers };
