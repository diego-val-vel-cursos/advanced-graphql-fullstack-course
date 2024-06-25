const { v4: uuidv4 } = require('uuid');
const driver = require('../../config/neo4j');

const gradoResolvers = {
  Query: {
    grados: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (g:Grado) RETURN g');
      await session.close();
      return result.records.map(record => record.get('g').properties);
    },
    grado: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run('MATCH (g:Grado {id: $id}) RETURN g', { id });
      await session.close();
      return result.records[0].get('g').properties;
    }
  },
  Mutation: {
    crearGrado: async (_, { numero }) => {
      const session = driver.session();
      const id = uuidv4();
      const result = await session.run(
        'CREATE (g:Grado {id: $id, numero: $numero}) RETURN g',
        { id, numero }
      );
      await session.close();
      return result.records[0].get('g').properties;
    },
    actualizarGrado: async (_, { id, numero }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (g:Grado {id: $id}) SET g.numero = $numero RETURN g',
        { id, numero }
      );
      await session.close();
      return result.records[0].get('g').properties;
    },
    eliminarGrado: async (_, { id }) => {
      const session = driver.session();
      try {
        await session.run('MATCH (g:Grado {id: $id})-[r]-() DELETE r', { id });
        await session.run('MATCH (g:Grado {id: $id}) DELETE g', { id });
        await session.close();
        return `Grado con id ${id} eliminado`;
      } catch (error) {
        await session.close();
        throw new Error('Error eliminando el grado: ' + error.message);
      }
    }
  }
};

module.exports = gradoResolvers;
