import React from 'react';
import { Box, Button } from '@mui/material';
import InfoModal from './InfoModal';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useAuth } from '../contexts/AuthContext';

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
  const { signInWithGoogle, signInWithFacebook } = useAuth();

  const handleGoogle = () => {
    signInWithGoogle();
    onClose();
  };

  const handleFacebook = () => {
    signInWithFacebook();
    onClose();
  };

  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title={isLogin ? 'Log In' : 'Sign Up'}
      maxWidth="xs"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Button
          variant="contained"
          onClick={handleGoogle}
          startIcon={<GoogleIcon />}
          sx={{
            backgroundColor: '#fff',
            color: '#212121',
            '&:hover': { backgroundColor: '#f1f1f1' },
          }}
        >
          Continue with Google
        </Button>
        <Button
          variant="contained"
          onClick={handleFacebook}
          startIcon={<FacebookIcon />}
          sx={{
            backgroundColor: '#1877F2',
            color: '#fff',
            '&:hover': { backgroundColor: '#166fe5' },
          }}
        >
          Continue with Facebook
        </Button>
      </Box>
    </InfoModal>
  );
}
