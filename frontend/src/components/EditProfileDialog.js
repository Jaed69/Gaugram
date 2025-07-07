import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Typography
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const EditProfileDialog = ({ open, onClose, onProfileUpdated }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    username: user?.username || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onProfileUpdated(updatedUser);
        onClose();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Perfil</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                src={user?.profileImage}
                sx={{ width: 60, height: 60 }}
              >
                {user?.fullName?.[0]}
              </Avatar>
              <Typography variant="h6">{user?.username}</Typography>
            </Box>
            
            <TextField
              name="fullName"
              label="Nombre completo"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            
            <TextField
              name="username"
              label="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            
            <TextField
              name="bio"
              label="Biografía"
              value={formData.bio}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Cuéntanos sobre ti..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileDialog;
