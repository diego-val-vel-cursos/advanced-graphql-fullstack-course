import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';
import { GET_ALUMNO, UPDATE_ALUMNO } from '../services/alumnoService';

const Alumno = ({ idUsuario }) => {
  const { data, loading, error } = useQuery(GET_ALUMNO, { variables: { alumnoId: idUsuario } });
  const [updateAlumno] = useMutation(UPDATE_ALUMNO);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(0);
  const [grupoId, setGrupoId] = useState('');

  useEffect(() => {
    if (data) {
      setNombre(data.alumno.nombre);
      setEdad(data.alumno.edad);
      setGrupoId(data.alumno.grupo.id);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAlumno({ variables: { actualizarAlumnoId: idUsuario, nombre, edad, grupoId } });
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
        <Typography variant="h5">Mis Datos (Alumno)</Typography>
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
          <TextField
            label="ID Grupo"
            value={grupoId}
            onChange={(e) => setGrupoId(e.target.value)}
            fullWidth
            margin="normal"
            disabled="true"
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

export default Alumno;
