const { v4: uuidv4 } = require('uuid');
const driver = require('../../config/neo4j');

const calificacionResolvers = {
  Query: {
    calificaciones: async (_, { limit = 10, offset = 0 }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (c:Calificacion)-[:TIENE_CALIFICACION]->(a:Alumno)-[:PERTENECE_A]->(g:Grupo)-[:PERTENECE_A]->(gr:Grado), ' +
        '(c)-[:DE]->(m:Materia), ' +
        '(c)-[:ASIGNADA_POR]->(p:Profesor) ' +
        'RETURN c, a, g, gr, m, p ' +
        'SKIP toInteger($offset) LIMIT toInteger($limit)', 
        { limit: parseInt(limit, 10), offset: parseInt(offset, 10) }
      );
      await session.close();
      return result.records.map(record => ({
        ...record.get('c').properties,
        alumno: {
          ...record.get('a').properties,
          grupo: {
            ...record.get('g').properties,
            grado: record.get('gr').properties
          }
        },
        materia: record.get('m').properties,
        profesor: record.get('p').properties
      }));
    },
    calificacion: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (c:Calificacion {id: $id})-[:TIENE_CALIFICACION]->(a:Alumno)-[:PERTENECE_A]->(g:Grupo)-[:PERTENECE_A]->(gr:Grado), ' +
        '(c)-[:DE]->(m:Materia), ' +
        '(c)-[:ASIGNADA_POR]->(p:Profesor) ' +
        'RETURN c, a, g, gr, m, p',
        { id }
      );
      await session.close();
      if (result.records.length === 0) {
        throw new Error('Calificación no encontrada');
      }
      const calificacion = result.records[0].get('c').properties;
      calificacion.alumno = {
        ...result.records[0].get('a').properties,
        grupo: {
          ...result.records[0].get('g').properties,
          grado: result.records[0].get('gr').properties
        }
      };
      calificacion.materia = result.records[0].get('m').properties;
      calificacion.profesor = result.records[0].get('p').properties;
      return calificacion;
    }
  },
  Mutation: {
    crearCalificacion: async (_, { nota, comentarios, alumno_id, materia_id, profesor_id }) => {
      const session = driver.session();
      const id = uuidv4();
      const result = await session.run(
        'MATCH (a:Alumno {id: $alumno_id})-[:PERTENECE_A]->(g:Grupo)-[:PERTENECE_A]->(gr:Grado), ' +
        '(m:Materia {id: $materia_id}), ' +
        '(p:Profesor {id: $profesor_id}) ' +
        'CREATE (c:Calificacion {id: $id, nota: $nota, comentarios: $comentarios}) ' +
        'CREATE (c)-[:TIENE_CALIFICACION]->(a) ' +
        'CREATE (c)-[:DE]->(m) ' +
        'CREATE (c)-[:ASIGNADA_POR]->(p) ' +
        'RETURN c, a, g, gr, m, p',
        { id, nota, comentarios, alumno_id, materia_id, profesor_id }
      );
      await session.close();
      return {
        ...result.records[0].get('c').properties,
        alumno: {
          ...result.records[0].get('a').properties,
          grupo: {
            ...result.records[0].get('g').properties,
            grado: result.records[0].get('gr').properties
          }
        },
        materia: result.records[0].get('m').properties,
        profesor: result.records[0].get('p').properties
      };
    },
    actualizarCalificacion: async (_, { id, nota, comentarios, alumno_id, materia_id, profesor_id }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (c:Calificacion {id: $id}) ' +
        'OPTIONAL MATCH (c)-[r1:TIENE_CALIFICACION]->(oldAlumno:Alumno) ' +
        'OPTIONAL MATCH (c)-[r2:DE]->(oldMateria:Materia) ' +
        'OPTIONAL MATCH (c)-[r3:ASIGNADA_POR]->(oldProfesor:Profesor) ' +
        'DELETE r1, r2, r3 ' +
        'WITH c ' +
        'MATCH (newAlumno:Alumno {id: $alumno_id})-[:PERTENECE_A]->(g:Grupo)-[:PERTENECE_A]->(gr:Grado), ' +
        '(newMateria:Materia {id: $materia_id}), ' +
        '(newProfesor:Profesor {id: $profesor_id}) ' +
        'SET c.nota = $nota, c.comentarios = $comentarios ' +
        'CREATE (c)-[:TIENE_CALIFICACION]->(newAlumno) ' +
        'CREATE (c)-[:DE]->(newMateria) ' +
        'CREATE (c)-[:ASIGNADA_POR]->(newProfesor) ' +
        'RETURN c, newAlumno, g, gr, newMateria, newProfesor',
        { id, nota, comentarios, alumno_id, materia_id, profesor_id }
      );
      await session.close();
      return {
        ...result.records[0].get('c').properties,
        alumno: {
          ...result.records[0].get('newAlumno').properties,
          grupo: {
            ...result.records[0].get('g').properties,
            grado: result.records[0].get('gr').properties
          }
        },
        materia: result.records[0].get('newMateria').properties,
        profesor: result.records[0].get('newProfesor').properties
      };
    },
    eliminarCalificacion: async (_, { id }) => {
      const session = driver.session();
      await session.run('MATCH (c:Calificacion {id: $id}) DETACH DELETE c', { id });
      await session.close();
      return `Calificación con id ${id} eliminada`;
    }
  }
};

module.exports = calificacionResolvers;
