import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ImageUpload from './ImageUpload';
import { PhotoCamera, TextFields } from '@mui/icons-material';

const CreatePostDialog = ({ open, onClose, onPostCreated }) => {
  const { token } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [content, setContent] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postType, setPostType] = useState('image'); // 'image' or 'text'

  const steps = postType === 'image' 
    ? ['Seleccionar imagen', 'Añadir detalles', 'Publicar']
    : ['Escribir contenido', 'Añadir detalles', 'Publicar'];

  const handleNext = () => {
    if (activeStep === 0) {
      if (postType === 'image' && !selectedImage) {
        setError('Por favor selecciona una imagen');
        return;
      }
      if (postType === 'text' && !content.trim()) {
        setError('Por favor escribe algo para tu post');
        return;
      }
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setError('');
  };

  const handleSubmit = async () => {
    // Validación según el tipo de post
    if (postType === 'image' && !selectedImage) {
      setError('Por favor selecciona una imagen');
      return;
    }
    if (postType === 'text' && !content.trim() && !caption.trim()) {
      setError('Por favor escribe algo para tu post');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      
      if (postType === 'image' && selectedImage) {
        // Post con imagen
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('caption', caption);
        formData.append('location', location);

        response = await fetch('/api/upload/post', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } else {
        // Post solo de texto
        response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content: content,
            caption: caption,
            location: location
          })
        });
      }

      if (response.ok) {
        const data = await response.json();
        onPostCreated(data.post);
        handleClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear el post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error de red. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedImage(null);
    setContent('');
    setCaption('');
    setLocation('');
    setError('');
    setPostType('image');
    onClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        if (postType === 'image') {
          return (
            <Box sx={{ mt: 2 }}>
              <ImageUpload
                onImageSelect={handleImageSelect}
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </Box>
          );
        } else {
          return (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="¿Qué estás pensando?"
                placeholder="Comparte tus pensamientos..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="outlined"
              />
            </Box>
          );
        }
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descripción"
              placeholder="Escribe una descripción para tu post..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 2200 }}
              helperText={`${caption.length}/2200 caracteres`}
            />
            <TextField
              fullWidth
              label="Ubicación"
              placeholder="Añadir ubicación"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              inputProps={{ maxLength: 100 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              ¿Listo para publicar?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Tu post será visible para todos tus seguidores.
            </Typography>
            {selectedImage && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    borderRadius: 8
                  }}
                />
              </Box>
            )}
            {caption && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Descripción:</strong> {caption}
              </Typography>
            )}
            {location && (
              <Typography variant="body2">
                <strong>Ubicación:</strong> {location}
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: 500 }
      }}
    >
      <DialogTitle>
        Crear nuevo post
      </DialogTitle>

      <DialogContent>
        {activeStep === 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              ¿Qué tipo de post quieres crear?
            </Typography>
            <ToggleButtonGroup
              value={postType}
              exclusive
              onChange={(e, newType) => newType && setPostType(newType)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="image" sx={{ flex: 1 }}>
                <PhotoCamera sx={{ mr: 1 }} />
                Con Imagen
              </ToggleButton>
              <ToggleButton value="text" sx={{ flex: 1 }}>
                <TextFields sx={{ mr: 1 }} />
                Solo Texto
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancelar
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Atrás
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && postType === 'image' && !selectedImage) ||
              (activeStep === 0 && postType === 'text' && !content.trim())
            }
          >
            Siguiente
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              loading || 
              (postType === 'image' && !selectedImage) ||
              (postType === 'text' && !content.trim() && !caption.trim())
            }
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostDialog;
