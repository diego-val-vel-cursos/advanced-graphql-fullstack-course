const { gql } = require('apollo-server');
const alumnoTypeDefs = require('./typeDefs/alumno');
const profesorTypeDefs = require('./typeDefs/profesor');
const usuarioTypeDefs = require('./typeDefs/usuario');
const calificacionTypeDefs = require('./typeDefs/calificacion');
const gradoTypeDefs = require('./typeDefs/grado');
const grupoTypeDefs = require('./typeDefs/grupo');
const materiaTypeDefs = require('./typeDefs/materia');

const alumnoResolvers = require('./resolvers/alumno');
const profesorResolvers = require('./resolvers/profesor');
const usuarioResolvers = require('./resolvers/usuario');
const calificacionResolvers = require('./resolvers/calificacion');
const gradoResolvers = require('./resolvers/grado');
const grupoResolvers = require('./resolvers/grupo');
const materiaResolvers = require('./resolvers/materia');

const typeDefs = gql`
  type Query
  type Mutation
  ${alumnoTypeDefs}
  ${profesorTypeDefs}
  ${usuarioTypeDefs}
  ${calificacionTypeDefs}
  ${gradoTypeDefs}
  ${grupoTypeDefs}
  ${materiaTypeDefs}
`;

const resolvers = {
  Query: {
    ...alumnoResolvers.Query,
    ...profesorResolvers.Query,
    ...usuarioResolvers.Query,
    ...calificacionResolvers.Query,
    ...gradoResolvers.Query,
    ...grupoResolvers.Query,
    ...materiaResolvers.Query
  },
  Mutation: {
    ...alumnoResolvers.Mutation,
    ...profesorResolvers.Mutation,
    ...usuarioResolvers.Mutation,
    ...calificacionResolvers.Mutation,
    ...gradoResolvers.Mutation,
    ...grupoResolvers.Mutation,
    ...materiaResolvers.Mutation
  }
};

module.exports = { typeDefs, resolvers };
