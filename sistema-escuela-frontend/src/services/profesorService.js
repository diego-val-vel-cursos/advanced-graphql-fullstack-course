import { gql } from '@apollo/client';

export const GET_PROFESOR = gql`
  query Profesor($profesorId: ID!) {
    profesor(id: $profesorId) {
      id
      nombre
      edad
    }
  }
`;

export const UPDATE_PROFESOR = gql`
  mutation Mutation($actualizarProfesorId: ID!, $nombre: String, $edad: Int) {
    actualizarProfesor(id: $actualizarProfesorId, nombre: $nombre, edad: $edad) {
      id
      nombre
      edad
    }
  }
`;
