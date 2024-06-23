const { v4: uuidv4 } = require('uuid');
const driver = require('../../config/neo4j');

const profesorResolvers = {
  Query: {
    profesor: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run('MATCH (p:Profesor {id: $id}) RETURN p', { id });
      await session.close();
      return result.records[0].get('p').properties;
    }
  },
  Mutation: {
    crearProfesor: async (_, { nombre, edad, materia }) => {
      const session = driver.session();
      const id = uuidv4(); // GENERAR EL UUID AQUÍ
      const result = await session.run(
        'CREATE (p:Profesor {id: $id, nombre: $nombre, edad: $edad, materia: $materia}) RETURN p',
        { id, nombre, edad, materia }
      );
      await session.close();
      return result.records[0].get('p').properties;
    }
  }
};

module.exports = profesorResolvers;
