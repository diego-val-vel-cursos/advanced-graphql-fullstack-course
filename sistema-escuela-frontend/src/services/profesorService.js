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
