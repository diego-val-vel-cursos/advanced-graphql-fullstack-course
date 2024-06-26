import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';
import { GET_PROFESOR, UPDATE_PROFESOR } from '../services/profesorService';

const Profesor = ({ idUsuario }) => {
  const { data, loading, error } = useQuery(GET_PROFESOR, { variables: { profesorId: idUsuario } });
  const [updateProfesor] = useMutation(UPDATE_PROFESOR);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(0);

  useEffect(() => {
    if (data) {
      setNombre(data.profesor.nombre);
      setEdad(data.profesor.edad);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfesor({ variables: { actualizarProfesorId: idUsuario, nombre, edad } });
      alert('Datos actualizados correctamente');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="h5">Mis Datos (Profesor)</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Edad"
            type="number"
            value={edad}
            onChange={(e) => setEdad(parseInt(e.target.value))}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Actualizar Datos
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Profesor;
