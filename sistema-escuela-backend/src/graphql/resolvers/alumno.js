const { v4: uuidv4 } = require('uuid');
const driver = require('../../config/neo4j');

const alumnoResolvers = {
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

module.exports = alumnoResolvers;
