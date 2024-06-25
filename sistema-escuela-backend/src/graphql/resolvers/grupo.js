const { v4: uuidv4 } = require('uuid');
const driver = require('../../config/neo4j');

const grupoResolvers = {
  Query: {
    grupos: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (g:Grupo)-[:PERTENECE_A]->(grado:Grado) RETURN g, grado');
      await session.close();
      return result.records.map(record => {
        const grupo = record.get('g').properties;
        grupo.grado = record.get('grado').properties;
        return grupo;
      });
    },
    grupo: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run('MATCH (g:Grupo {id: $id})-[:PERTENECE_A]->(grado:Grado) RETURN g, grado', { id });
      await session.close();
      if (result.records.length === 0) {
        throw new Error('Grupo no encontrado');
      }
      const grupo = result.records[0].get('g').properties;
      grupo.grado = result.records[0].get('grado').properties;
      return grupo;
    }
  },
  Mutation: {
    crearGrupo: async (_, { nombre, grado_id }) => {
      const session = driver.session();
      const id = uuidv4();
      const result = await session.run(
        'MATCH (grado:Grado {id: $grado_id}) ' +
        'CREATE (g:Grupo {id: $id, nombre: $nombre})-[:PERTENECE_A]->(grado) RETURN g, grado',
        { id, nombre, grado_id }
      );
      await session.close();
      const grupo = result.records[0].get('g').properties;
      grupo.grado = result.records[0].get('grado').properties;
      return grupo;
    },
    actualizarGrupo: async (_, { id, nombre, grado_id }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (g:Grupo {id: $id}) ' +
        'OPTIONAL MATCH (g)-[r:PERTENECE_A]->() ' +
        'DELETE r ' +
        'WITH g ' +
        'MATCH (grado:Grado {id: $grado_id}) ' +
        'CREATE (g)-[:PERTENECE_A]->(grado) ' +
        'SET g.nombre = $nombre ' +
        'RETURN g, grado',
        { id, nombre, grado_id }
      );
      await session.close();
      const grupo = result.records[0].get('g').properties;
      grupo.grado = result.records[0].get('grado').properties;
      return grupo;
    },
    eliminarGrupo: async (_, { id }) => {
      const session = driver.session();
      await session.run('MATCH (g:Grupo {id: $id}) DETACH DELETE g', { id });
      await session.close();
      return `Grupo con id ${id} eliminado`;
    }
  }
};

module.exports = grupoResolvers;
