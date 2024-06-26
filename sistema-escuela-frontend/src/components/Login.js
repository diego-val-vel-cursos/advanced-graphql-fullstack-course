import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Container, Box, TextField, Button, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const LOGIN_QUERY = gql`
  query Query($correo: String!, $password: String!, $rol: String!) {
    login(correo: $correo, password: $password, rol: $rol) {
      id
      correo
      password
      rol
      idUsuario
    }
  }
`;

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [login, { data, loading, error }] = useLazyQuery(LOGIN_QUERY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ variables: { correo, password, rol } });
      // Manejar el almacenamiento del token y redireccionamiento
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              id="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <MenuItem value="alumno">Alumno</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            Login
          </Button>
          {loading && <Typography variant="body1">Loading...</Typography>}
          {error && <Alert severity="error">{error.message}</Alert>}
          {data && <Alert severity="success">Login Successful</Alert>}
        </form>
      </Box>
    </Container>
  );
};

export default Login;
