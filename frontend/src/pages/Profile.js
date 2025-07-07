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

const Profile = () => {
  const { user, isAuthenticated, token, loading: authLoading } = useAuth();
  const [profileImageDialogOpen, setProfileImageDialogOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);

  // Función para obtener datos actualizados del usuario
  const fetchUserProfile = async () => {
    if (!token) {
      console.log('No token available for fetchUserProfile');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        
        // Actualizar localStorage para sincronizar
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.error('Profile fetch failed:', response.status, response.statusText);
        // Si falla, usar los datos del usuario actual
        if (user) {
          setCurrentUser(user);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Si hay error, usar los datos del usuario actual
      if (user) {
        setCurrentUser(user);
      }
    }
  };

  const fetchUserPosts = async () => {
    const userId = currentUser?._id || user?._id || user?.id;
    
    if (!userId) {
      console.log('No user ID available for fetchUserPosts');
      setLoading(false);
      return;
    }
    
    try {
      console.log('=== FETCHING USER POSTS ===');
      console.log('User ID:', userId);
      
      const response = await fetch(`/api/posts/user/${userId}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const posts = await response.json();
        console.log('Posts received:', posts.length);
        console.log('Posts data:', posts);
        setUserPosts(posts);
        
        // Actualizar contador de posts en el usuario actual
        setCurrentUser(prev => prev ? {
          ...prev,
          postsCount: posts.length
        } : null);
      } else {
        console.error('Posts fetch failed:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setUserPosts([]);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    } finally {
      console.log('fetchUserPosts completed, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Profile useEffect triggered:', { 
      user: !!user, 
      userId: user?._id || user?.id,
      token: !!token, 
      isAuthenticated,
      authLoading
    });
    
    // No hacer nada si la autenticación aún está cargando
    if (authLoading) {
      console.log('Auth still loading, skipping profile load');
      return;
    }
    
    // Timeout de seguridad para evitar loading infinito
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached, forcing loading to false');
      setLoading(false);
    }, 10000); // 10 segundos máximo
    
    if (isAuthenticated && user && user._id) {
      console.log('Loading profile for authenticated user:', user._id);
      // Establecer datos básicos del usuario inmediatamente
      setCurrentUser(user);
      setLoading(true);
      
      // Obtener posts del usuario
      fetchUserPosts().finally(() => {
        clearTimeout(loadingTimeout);
      });
      
      // Luego obtener datos actualizados del perfil si hay token
      if (token) {
        fetchUserProfile();
      }
    } else {
      console.log('No authenticated user found, stopping loading');
      setLoading(false);
      clearTimeout(loadingTimeout);
    }
    
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [user?._id, token, isAuthenticated, authLoading]);

  const handleImageUpdated = (newImageUrl) => {
    setCurrentUser(prev => prev ? {
      ...prev,
      profileImage: newImageUrl
    } : null);
    // Refrescar datos del perfil después de actualizar imagen
    fetchUserProfile();
  };

  // Función para refrescar todo el perfil
  const refreshProfile = () => {
    fetchUserProfile();
    fetchUserPosts();
  };

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Cargando perfil...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" color="error">
          Error: No se pudo cargar la información del perfil
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={currentUser?.profileImage} 
              sx={{ width: 120, height: 120, mr: 3, fontSize: '2rem' }}
            >
              {currentUser?.fullName?.[0] || currentUser?.username?.[0]}
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
                {currentUser?.username}
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
                onClick={refreshProfile}
              >
                Actualizar
              </Button>
            </Box>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {currentUser?.fullName}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {currentUser?.email}
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Typography variant="body1">
                <strong>{currentUser?.postsCount || 0}</strong> posts
              </Typography>
              <Typography variant="body1">
                <strong>{currentUser?.followersCount || 0}</strong> seguidores
              </Typography>
              <Typography variant="body1">
                <strong>{currentUser?.followingCount || 0}</strong> siguiendo
              </Typography>
            </Box>

            {currentUser?.bio && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {currentUser.bio}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={currentUser?.isVerified ? 'Verificado' : 'No verificado'}
                color={currentUser?.isVerified ? 'primary' : 'default'}
                size="small"
              />
              <Chip 
                label={currentUser?.isPrivate ? 'Privado' : 'Público'}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Box>        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Posts ({userPosts.length})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={refreshProfile}
              sx={{ textTransform: 'none' }}
            >
              🔄 Sincronizar
            </Button>
          </Box>
          
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
                          // TODO: Abrir modal con post completo
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
                          // TODO: Abrir modal con post completo
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
            Miembro desde: {new Date(currentUser?.createdAt).toLocaleDateString()}
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

export default Profile;
