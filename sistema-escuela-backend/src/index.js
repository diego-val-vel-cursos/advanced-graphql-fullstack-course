// IMPORTAR PAQUETES NECESARIOS
const { ApolloServer, gql } = require('apollo-server');
const neo4j = require('neo4j-driver');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid'); // IMPORTAR EL PAQUETE UUID

// CONFIGURACIÓN DE NEO4J
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// ESQUEMA GRAPHQL
const typeDefs = gql`
  type Alumno {
    id: ID!
    nombre: String!
    edad: Int!
    curso: String!
  }

  type Query {
    alumnos: [Alumno]
    alumno(id: ID!): Alumno
  }

  type Mutation {
    crearAlumno(nombre: String!, edad: Int!, curso: String!): Alumno
    actualizarAlumno(id: ID!, nombre: String, edad: Int, curso: String): Alumno
    eliminarAlumno(id: ID!): String
  }
`;

// RESOLVERS
const resolvers = {
  Query: {
    alumnos: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (a:Alumno) RETURN a');
      await session.close();
      return result.records.map(record => record.get('a').properties);
    },
    alumno: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run('MATCH (a:Alumno {id: $id}) RETURN a', { id });
      await session.close();
      return result.records[0].get('a').properties;
    }
  },
  Mutation: {
    crearAlumno: async (_, { nombre, edad, curso }) => {
      const session = driver.session();
      const id = uuidv4(); // GENERAR EL UUID AQUÍ
      const result = await session.run(
        'CREATE (a:Alumno {id: $id, nombre: $nombre, edad: $edad, curso: $curso}) RETURN a',
        { id, nombre, edad, curso }
      );
      await session.close();
      return result.records[0].get('a').properties;
    },
    actualizarAlumno: async (_, { id, nombre, edad, curso }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (a:Alumno {id: $id}) SET a += {nombre: $nombre, edad: $edad, curso: $curso} RETURN a',
        { id, nombre, edad, curso }
      );
      await session.close();
      return result.records[0].get('a').properties;
    },
    eliminarAlumno: async (_, { id }) => {
      const session = driver.session();
      await session.run('MATCH (a:Alumno {id: $id}) DELETE a', { id });
      await session.close();
      return `Alumno con id ${id} eliminado`;
    }
  }
};

// INICIAR EL SERVIDOR APOLLO
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
});
