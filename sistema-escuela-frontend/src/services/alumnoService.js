import { gql } from '@apollo/client';

export const GET_ALUMNO = gql`
  query Alumno($alumnoId: ID!) {
    alumno(id: $alumnoId) {
      id
      nombre
      edad
      grupo {
        id
        nombre
        grado {
          id
          numero
        }
      }
    }
  }
`;

export const UPDATE_ALUMNO = gql`
  mutation Mutation($actualizarAlumnoId: ID!, $nombre: String, $edad: Int, $grupoId: ID) {
    actualizarAlumno(id: $actualizarAlumnoId, nombre: $nombre, edad: $edad, grupo_id: $grupoId) {
      id
      nombre
      edad
      grupo {
        id
        nombre
        grado {
          id
          numero
        }
      }
    }
  }
`;
