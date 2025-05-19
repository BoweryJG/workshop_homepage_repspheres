import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';

/**
 * ThemeToggle component for switching between light and dark themes
 * 
 * This component provides a toggle button to switch between light and dark modes.
 * It automatically adjusts its icon based on the current theme.
 */
export default function ThemeToggle({ onToggle }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // If no onToggle function is provided, use a placeholder
  const handleToggle = onToggle || (() => {
    console.log('Theme toggle clicked. To implement theme switching, pass an onToggle function.');
  });

  return (
    <IconButton 
      onClick={handleToggle}
      color="inherit"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      sx={{ 
        color: '#fff',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.1)'
        },
      }}
    >
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
