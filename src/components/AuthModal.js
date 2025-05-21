import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import InfoModal from './InfoModal';

/**
 * AuthModal - login or signup form inside InfoModal
 *
 * Props:
 *  - open: boolean to control visibility
 *  - onClose: function to close the modal
 *  - mode: 'login' or 'signup'
 */
export default function AuthModal({ open, onClose, mode = 'login' }) {
  const isLogin = mode === 'login';

  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title={isLogin ? 'Log In' : 'Sign Up'}
      maxWidth="xs"
    >
      <Box
        component="form"
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
      >
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="filled"
          InputProps={{ style: { background: 'rgba(255,255,255,0.1)' } }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="filled"
          InputProps={{ style: { background: 'rgba(255,255,255,0.1)' } }}
        />
        {!isLogin && (
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            variant="filled"
            InputProps={{ style: { background: 'rgba(255,255,255,0.1)' } }}
          />
        )}
        <Button variant="contained" color="primary">
          {isLogin ? 'Log In' : 'Sign Up'}
        </Button>
      </Box>
    </InfoModal>
  );
}
