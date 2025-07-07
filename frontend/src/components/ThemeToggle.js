import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ size = 'medium', color = 'inherit' }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <IconButton 
        onClick={toggleTheme} 
        color={color}
        size={size}
        sx={{
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
