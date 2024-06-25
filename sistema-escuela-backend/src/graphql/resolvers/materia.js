const { v4: uuidv4 } = require('uuid');
const driver = require('../../config/neo4j');

const materiaResolvers = {
  Query: {
    materias: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (m:Materia) RETURN m');
      await session.close();
      return result.records.map(record => record.get('m').properties);
    },
    materia: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run('MATCH (m:Materia {id: $id}) RETURN m', { id });
      await session.close();
      if (result.records.length === 0) {
        throw new Error('Materia no encontrada');
      }
      return result.records[0].get('m').properties;
    }
  },
  Mutation: {
    crearMateria: async (_, { nombre, tipo }) => {
      const session = driver.session();
      const id = uuidv4();
      const result = await session.run(
        'CREATE (m:Materia {id: $id, nombre: $nombre, tipo: $tipo}) RETURN m',
        { id, nombre, tipo }
      );
      await session.close();
      return result.records[0].get('m').properties;
    },
    actualizarMateria: async (_, { id, nombre, tipo }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (m:Materia {id: $id}) SET m += {nombre: $nombre, tipo: $tipo} RETURN m',
        { id, nombre, tipo }
      );
      await session.close();
      return result.records[0].get('m').properties;
    },
    eliminarMateria: async (_, { id }) => {
      const session = driver.session();
      await session.run('MATCH (m:Materia {id: $id}) DELETE m', { id });
      await session.close();
      return `Materia con id ${id} eliminada`;
    }
  }
};

module.exports = materiaResolvers;
