import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ImageUpload from './ImageUpload';

const ProfileImageUpload = ({ open, onClose, onImageUpdated }) => {
  const { user, token } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('profileImage', selectedImage);

      const response = await fetch('/api/upload/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        onImageUpdated(data.profileImage);
        handleClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setError('Error de red. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Actualizar imagen de perfil
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user?.profileImage}
            alt={user?.fullName}
            sx={{ width: 80, height: 80, mr: 2 }}
          >
            {user?.fullName?.[0] || user?.username?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {user?.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user?.username}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecciona una nueva imagen de perfil. Se recomienda usar una imagen cuadrada.
        </Typography>

        <ImageUpload
          onImageSelect={handleImageSelect}
          maxSize={5 * 1024 * 1024} // 5MB para perfiles
          acceptedFiles="image/*"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading || !selectedImage}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Subiendo...' : 'Actualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileImageUpload;
