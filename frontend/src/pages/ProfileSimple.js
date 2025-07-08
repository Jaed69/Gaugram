import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  Chip, 
  IconButton, 
  Grid,
  Card,
  CardMedia,
  Button,
  CircularProgress
} from '@mui/material';
import { PhotoCamera, Edit, Refresh } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ProfileImageUpload from '../components/ProfileImageUpload';

const ProfileSimple = () => {
  const { user, isAuthenticated, token, loading: authLoading } = useAuth();
  const [profileImageDialogOpen, setProfileImageDialogOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Establecer el usuario actual cuando el contexto de auth esté listo
  useEffect(() => {
    if (user && !authLoading) {
      setCurrentUser(user);
      
      // Si el usuario no tiene _id, intentar obtener datos actualizados
      if (!user._id && token) {
        fetchUserProfile();
      }
    }
  }, [user, authLoading, token]);

  // Función para obtener datos actualizados del usuario
  const fetchUserProfile = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Updated user data:', userData);
        setCurrentUser(userData);
        
        // Actualizar también en el contexto de autenticación
        // Este es un hack, pero necesario para sincronizar los datos
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Función para cargar posts del usuario
  const loadUserPosts = async () => {
    const userId = currentUser?._id || user?._id;
    
    if (!userId) {
      console.log('No user ID available for loading posts');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading posts for user:', userId);
      const response = await fetch(`/api/posts/user/${userId}`);
      if (response.ok) {
        const posts = await response.json();
        console.log('Posts loaded:', posts.length);
        setUserPosts(posts);
      } else {
        setError('Error al cargar los posts');
        setUserPosts([]);
      }
    } catch (err) {
      setError('Error de conexión');
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar posts cuando el usuario esté disponible
  useEffect(() => {
    const userId = currentUser?._id || user?._id;
    if (userId && !authLoading) {
      loadUserPosts();
    }
  }, [currentUser?._id, user?._id, authLoading]);

  const handleImageUpdated = (newImageUrl) => {
    setCurrentUser(prev => prev ? {
      ...prev,
      profileImage: newImageUrl
    } : null);
  };

  // Mostrar loading mientras se autentica
  if (authLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Verificando autenticación...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mostrar error si no hay usuario
  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            No se pudo cargar la información del perfil
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Recargar página
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={currentUser.profileImage} 
              sx={{ width: 120, height: 120, mr: 3, fontSize: '2rem' }}
            >
              {currentUser.fullName?.[0] || currentUser.username?.[0]}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 24,
                backgroundColor: 'background.paper',
                border: 2,
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => setProfileImageDialogOpen(true)}
            >
              <PhotoCamera />
            </IconButton>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
                {currentUser.username}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Edit />}
                sx={{ mr: 1 }}
              >
                Editar perfil
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={() => {
                  fetchUserProfile();
                  loadUserPosts();
                }}
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </Button>
            </Box>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {currentUser.fullName}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {currentUser.email}
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Typography variant="body1">
                <strong>{userPosts.length}</strong> posts
              </Typography>
              <Typography variant="body1">
                <strong>{currentUser.followersCount || 0}</strong> seguidores
              </Typography>
              <Typography variant="body1">
                <strong>{currentUser.followingCount || 0}</strong> siguiendo
              </Typography>
            </Box>

            {currentUser.bio && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {currentUser.bio}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={currentUser.isVerified ? 'Verificado' : 'No verificado'}
                color={currentUser.isVerified ? 'primary' : 'default'}
                size="small"
              />
              <Chip 
                label={currentUser.isPrivate ? 'Privado' : 'Público'}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Posts ({userPosts.length})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                fetchUserProfile();
                loadUserPosts();
              }}
              disabled={loading}
              sx={{ textTransform: 'none' }}
            >
              {loading ? '🔄 Cargando...' : '🔄 Sincronizar'}
            </Button>
          </Box>

          {error && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: 'error.light', borderRadius: 1 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          
          {userPosts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No has publicado ningún post aún
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ¡Comparte tu primera foto!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={1}>
              {userPosts.map((post) => (
                <Grid item xs={4} key={post._id}>
                  <Card sx={{ aspectRatio: '1/1' }}>
                    {post.imageUrl ? (
                      <CardMedia
                        component="img"
                        image={post.imageUrl}
                        alt="User post"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          console.log('Open post:', post._id);
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'grey.100',
                          cursor: 'pointer',
                          p: 2
                        }}
                        onClick={() => {
                          console.log('Open post:', post._id);
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            textAlign: 'center'
                          }}
                        >
                          {post.content || post.caption || 'Post de texto'}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Miembro desde: {new Date(currentUser.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>

      <ProfileImageUpload
        open={profileImageDialogOpen}
        onClose={() => setProfileImageDialogOpen(false)}
        onImageUpdated={handleImageUpdated}
      />
    </Container>
  );
};

export default ProfileSimple;
