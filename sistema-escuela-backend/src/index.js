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

  type Profesor {
    id: ID!
    nombre: String!
    edad: Int!
    materia: String!
  }

  type Query {
    alumnos: [Alumno]
    alumno(id: ID!): Alumno
    profesores: [Profesor]
    profesor(id: ID!): Profesor
  }

  type Mutation {
    crearAlumno(nombre: String!, edad: Int!, curso: String!): Alumno
    actualizarAlumno(id: ID!, nombre: String, edad: Int, curso: String): Alumno
    eliminarAlumno(id: ID!): String

    crearProfesor(nombre: String!, edad: Int!, materia: String!): Profesor
    actualizarProfesor(id: ID!, nombre: String, edad: Int, materia: String): Profesor
    eliminarProfesor(id: ID!): String
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
    },
    profesores: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (p:Profesor) RETURN p');
      await session.close();
      return result.records.map(record => record.get('p').properties);
    },
    profesor: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run('MATCH (p:Profesor {id: $id}) RETURN p', { id });
      await session.close();
      return result.records[0].get('p').properties;
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
    },

    crearProfesor: async (_, { nombre, edad, materia }) => {
      const session = driver.session();
      const id = uuidv4(); // GENERAR EL UUID AQUÍ
      const result = await session.run(
        'CREATE (p:Profesor {id: $id, nombre: $nombre, edad: $edad, materia: $materia}) RETURN p',
        { id, nombre, edad, materia }
      );
      await session.close();
      return result.records[0].get('p').properties;
    },
    actualizarProfesor: async (_, { id, nombre, edad, materia }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (p:Profesor {id: $id}) SET p += {nombre: $nombre, edad: $edad, materia: $materia} RETURN p',
        { id, nombre, edad, materia }
      );
      await session.close();
      return result.records[0].get('p').properties;
    },
    eliminarProfesor: async (_, { id }) => {
      const session = driver.session();
      await session.run('MATCH (p:Profesor {id: $id}) DELETE p', { id });
      await session.close();
      return `Profesor con id ${id} eliminado`;
    }
  }
};

// INICIAR EL SERVIDOR APOLLO
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
});
