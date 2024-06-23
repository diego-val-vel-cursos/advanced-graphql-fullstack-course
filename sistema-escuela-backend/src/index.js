const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('./graphql');

// INICIAR EL SERVIDOR APOLLO
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
});
