const { v4: uuidv4 } = require('uuid');
const driver = require('../../config/neo4j');

const alumnoResolvers = {
  Query: {
    alumnos: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (a:Alumno)-[:PERTENECE_A]->(g:Grupo)-[:PERTENECE_A]->(gr:Grado) RETURN a, g, gr');
      await session.close();
      return result.records.map(record => ({
        ...record.get('a').properties,
        grupo: {
          ...record.get('g').properties,
          grado: record.get('gr').properties
        }
      }));
    },
    alumno: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run('MATCH (a:Alumno {id: $id})-[:PERTENECE_A]->(g:Grupo)-[:PERTENECE_A]->(gr:Grado) RETURN a, g, gr', { id });
      await session.close();
      const alumno = result.records[0].get('a').properties;
      alumno.grupo = {
        ...result.records[0].get('g').properties,
        grado: result.records[0].get('gr').properties
      };
      return alumno;
    }
  },
  Mutation: {
    crearAlumno: async (_, { nombre, edad, grupo_id }) => {
      const session = driver.session();
      const id = uuidv4();
      const result = await session.run(
        'MATCH (g:Grupo {id: $grupo_id}) ' +
        'CREATE (a:Alumno {id: $id, nombre: $nombre, edad: $edad})-[:PERTENECE_A]->(g) ' +
        'RETURN a, g',
        { id, nombre, edad, grupo_id }
      );
      const grupo = result.records[0].get('g').properties;
      const gradoResult = await session.run(
        'MATCH (g:Grupo {id: $grupo_id})-[:PERTENECE_A]->(gr:Grado) RETURN gr', { grupo_id }
      );
      grupo.grado = gradoResult.records[0].get('gr').properties;
      await session.close();
      return {
        ...result.records[0].get('a').properties,
        grupo
      };
    },
    actualizarAlumno: async (_, { id, nombre, edad, grupo_id }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (a:Alumno {id: $id}) ' +
        'OPTIONAL MATCH (a)-[rel:PERTENECE_A]->(:Grupo) ' +
        'DELETE rel ' +
        'WITH a ' +
        'MATCH (g:Grupo {id: $grupo_id}) ' +
        'SET a.nombre = $nombre, a.edad = $edad ' +
        'CREATE (a)-[:PERTENECE_A]->(g) ' +
        'RETURN a, g',
        { id, nombre, edad, grupo_id }
      );
      const grupo = result.records[0].get('g').properties;
      const gradoResult = await session.run(
        'MATCH (g:Grupo {id: $grupo_id})-[:PERTENECE_A]->(gr:Grado) RETURN gr', { grupo_id }
      );
      grupo.grado = gradoResult.records[0].get('gr').properties;
      await session.close();
      return {
        ...result.records[0].get('a').properties,
        grupo
      };
    },
    eliminarAlumno: async (_, { id }) => {
      const session = driver.session();
      try {
        await session.run('MATCH (a:Alumno {id: $id}) DETACH DELETE a', { id });
        await session.close();
        return `Alumno con id ${id} eliminado`;
      } catch (error) {
        await session.close();
        throw new Error(`Error al eliminar el alumno con id ${id}: ${error.message}`);
      }
    }
  },
  Alumno: {
    grupo: async (parent) => {
      const session = driver.session();
      const result = await session.run('MATCH (a:Alumno {id: $id})-[:PERTENECE_A]->(g:Grupo) RETURN g', { id: parent.id });
      await session.close();
      const grupo = result.records[0].get('g').properties;
      const gradoResult = await session.run('MATCH (g:Grupo {id: $id})-[:PERTENECE_A]->(gr:Grado) RETURN gr', { id: grupo.id });
      grupo.grado = gradoResult.records[0].get('gr').properties;
      return grupo;
    }
  }
};

module.exports = alumnoResolvers;
