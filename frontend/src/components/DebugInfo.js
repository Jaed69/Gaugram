import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const DebugInfo = () => {
  const { user, isAuthenticated, token, loading, logout } = useAuth();
  
  const clearAndReload = () => {
    localStorage.clear();
    window.location.reload();
  };
  
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>Debug Info</Typography>
      <Typography variant="body2">
        <strong>Auth Loading:</strong> {loading ? 'Yes' : 'No'}
      </Typography>
      <Typography variant="body2">
        <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
      </Typography>
      <Typography variant="body2">
        <strong>Has Token:</strong> {token ? 'Yes' : 'No'}
      </Typography>
      <Typography variant="body2">
        <strong>User ID:</strong> {user?._id || user?.id || 'None'}
      </Typography>
      <Typography variant="body2">
        <strong>Username:</strong> {user?.username || 'None'}
      </Typography>
      <Typography variant="body2">
        <strong>Full Name:</strong> {user?.fullName || 'None'}
      </Typography>
      <Typography variant="body2">
        <strong>Timestamp:</strong> {new Date().toLocaleTimeString()}
      </Typography>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button 
          size="small" 
          variant="outlined" 
          color="warning"
          onClick={clearAndReload}
        >
          🔄 Clear & Reload
        </Button>
        <Button 
          size="small" 
          variant="outlined" 
          color="secondary"
          onClick={logout}
        >
          🚪 Logout
        </Button>
      </Box>
    </Paper>
  );
};

export default DebugInfo;
