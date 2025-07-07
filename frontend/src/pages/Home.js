import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Fab, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePostDialog from '../components/CreatePostDialog';

const Home = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createPostOpen, setCreatePostOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError('Error al cargar los posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Error de red al cargar los posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId, liked) => {
    setPosts(posts.map(post => 
      post._id === postId 
        ? { ...post, likesCount: liked ? post.likesCount + 1 : post.likesCount - 1 }
        : post
    ));
  };

  const handleFollow = (userId, isFollowing) => {
    // Actualizar los posts para reflejar el estado de seguimiento
    setPosts(posts.map(post => 
      post.userId._id === userId 
        ? { ...post, isFollowing }
        : post
    ));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Cargando posts...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Gaugram Feed
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Inicia sesión para crear posts y dar likes
        </Alert>
      )}

      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay posts disponibles
          </Typography>
          {isAuthenticated && (
            <Typography variant="body2" color="text.secondary">
              ¡Sé el primero en compartir algo!
            </Typography>
          )}
        </Box>
      ) : (
        <Box>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onFollow={handleFollow}
              onComment={(postId) => {
                // TODO: Implementar navegación a comentarios
                console.log('Navigate to comments for post:', postId);
              }}
            />
          ))}
        </Box>
      )}

      {/* Botón flotante para crear post */}
      {isAuthenticated && (
        <Fab
          color="primary"
          aria-label="create post"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setCreatePostOpen(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Dialog para crear post */}
      <CreatePostDialog
        open={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </Container>
  );
};

export default Home;
