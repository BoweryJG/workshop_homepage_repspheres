import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { Box, Button, Stack, TextField, Typography, Divider } from '@mui/material';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    if (storedName && storedEmail) {
      setName(storedName);
      setEmail(storedEmail);
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (name && email) {
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    setName('');
    setEmail('');
    setLoggedIn(false);
  };

  const handleProvider = (provider) => {
    // Placeholder for Google/Facebook login integrations
    alert(`This would start the ${provider} login flow.`);
  };

  return (
    <div>
      <NavBar />
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {loggedIn ? (
          <Box>
            <Typography sx={{ mb: 2 }}>
              Logged in as {name} ({email})
            </Typography>
            <Button variant="contained" onClick={handleLogout}>
              Log Out
            </Button>
          </Box>
        ) : (
          <Stack component="form" onSubmit={handleLogin} spacing={2} sx={{ maxWidth: 360 }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button variant="contained" type="submit">
              Login
            </Button>
            <Divider>or</Divider>
            <Button variant="outlined" onClick={() => handleProvider('Google')}>
              Login with Google
            </Button>
            <Button variant="outlined" onClick={() => handleProvider('Facebook')}>
              Login with Facebook
            </Button>
          </Stack>
        )}
      </Box>
    </div>
  );
}
