import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { CloudUpload, PhotoCamera } from '@mui/icons-material';

// Función helper para convertir archivo a Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remover el prefijo "data:image/...;base64," para obtener solo el Base64
      const base64 = reader.result.split(',')[1];
      resolve({
        data: base64,
        type: file.type,
        name: file.name,
        size: file.size,
        fullDataUrl: reader.result // Para preview
      });
    };
    reader.onerror = error => reject(error);
  });
};

const ImageUpload = ({ onImageSelect, acceptedFiles = 'image/*', maxSize = 10485760, preview = true }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploading(true);
      try {
        // Convertir archivo a Base64
        const base64Data = await fileToBase64(file);
        
        // Crear preview
        if (preview) {
          setPreviewUrl(base64Data.fullDataUrl);
        }
        
        // Pasar datos Base64 al componente padre
        onImageSelect(base64Data);
      } catch (error) {
        console.error('Error converting file to Base64:', error);
      } finally {
        setUploading(false);
      }
    }
  }, [onImageSelect, preview]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize,
    multiple: false
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : isDragReject ? 'error.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography variant="body2">Subiendo imagen...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {isDragActive ? (
              <>
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" color="primary">
                  Suelta la imagen aquí
                </Typography>
              </>
            ) : (
              <>
                <PhotoCamera sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.primary">
                  Arrastra una imagen o haz clic para seleccionar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Máximo {formatFileSize(maxSize)} • JPG, PNG, GIF, WEBP
                </Typography>
              </>
            )}
          </Box>
        )}

        {isDragReject && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Archivo no válido. Solo se permiten imágenes.
          </Typography>
        )}
      </Paper>

      {previewUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" gutterBottom>
            Vista previa:
          </Typography>
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              maxWidth: '100%',
              maxHeight: 300,
              borderRadius: 1,
              boxShadow: 2
            }}
          />
          <Box sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setPreviewUrl(null);
                onImageSelect(null);
              }}
            >
              Eliminar imagen
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
