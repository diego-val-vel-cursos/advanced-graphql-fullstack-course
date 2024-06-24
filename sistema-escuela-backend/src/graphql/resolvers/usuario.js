const { v4: uuidv4 } = require('uuid');
const driver = require('../../config/neo4j');

const usuarioResolvers = {
  Query: {
    login: async (_, { correo, password, rol }) => {
      const session = driver.session();
      try {
        const result = await session.run(
          'MATCH (u:Usuario {correo: $correo, password: $password, rol: $rol}) RETURN u',
          { correo, password, rol }
        );
        if (result.records.length === 0) {
          throw new Error('Usuario no encontrado o contraseña incorrecta');
        }

        const usuario = result.records[0].get('u').properties;
        const idUsuario = usuario.idUsuario;

        let userDetail;
        if (rol === 'profesor') {
          const resultProfesor = await session.run(
            'MATCH (p:Profesor {id: $idUsuario}) RETURN p',
            { idUsuario }
          );
          if (resultProfesor.records.length === 0) {
            throw new Error('Profesor no encontrado');
          }
          userDetail = resultProfesor.records[0].get('p').properties;
        } else if (rol === 'alumno') {
          const resultAlumno = await session.run(
            'MATCH (a:Alumno {id: $idUsuario}) RETURN a',
            { idUsuario }
          );
          if (resultAlumno.records.length === 0) {
            throw new Error('Alumno no encontrado');
          }
          userDetail = resultAlumno.records[0].get('a').properties;
        }

        return { ...usuario, ...userDetail };
      } finally {
        await session.close();
      }
    },
    usuarios: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (u:Usuario) RETURN u');
      await session.close();
      return result.records.map(record => record.get('u').properties);
    },
    usuario: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run('MATCH (u:Usuario {id: $id}) RETURN u', { id });
      await session.close();
      return result.records[0].get('u').properties;
    }
  },
  Mutation: {
    crearUsuario: async (_, { correo, password, rol, idUsuario }) => {
      const session = driver.session();
      const id = uuidv4();
      const result = await session.run(
        'CREATE (u:Usuario {id: $id, correo: $correo, password: $password, rol: $rol, idUsuario: $idUsuario}) RETURN u',
        { id, correo, password, rol, idUsuario }
      );
      await session.close();
      return result.records[0].get('u').properties;
    },
    actualizarUsuario: async (_, { id, correo, password, rol, idUsuario }) => {
      const session = driver.session();
      const result = await session.run(
        'MATCH (u:Usuario {id: $id}) SET u += {correo: $correo, password: $password, rol: $rol, idUsuario: $idUsuario} RETURN u',
        { id, correo, password, rol, idUsuario }
      );
      await session.close();
      return result.records[0].get('u').properties;
    },
    eliminarUsuario: async (_, { id }) => {
      const session = driver.session();
      await session.run('MATCH (u:Usuario {id: $id}) DELETE u', { id });
      await session.close();
      return `Usuario con id ${id} eliminado`;
    }
  }
};

module.exports = usuarioResolvers;
