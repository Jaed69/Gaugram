import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  Collapse,
  Divider,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  BookmarkBorder,
  MoreVert,
  Verified,
  Send,
  ExpandMore,
  ExpandLess,
  PersonAdd,
  PersonRemove
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PostCard = ({ post, onLike, onComment, onFollow }) => {
  const { user, token } = useAuth();
  const { darkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isFollowing, setIsFollowing] = useState(user?.following?.includes(post.userId?._id) || false);
  const [followLoading, setFollowLoading] = useState(false);

  // Verificar si el post es del usuario actual
  const isOwnPost = user?._id === post.userId?._id;

  const handleFollow = async () => {
    if (!token || isOwnPost || followLoading) return;

    setFollowLoading(true);
    try {
      const response = await fetch(`/api/users/${post.userId._id}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        if (onFollow) onFollow(post.userId._id, data.isFollowing);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLike = async () => {
    if (!token) return;

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikesCount(data.likesCount);
        if (onLike) onLike(post._id, data.liked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!token || !commentText.trim()) return;

    try {
      const response = await fetch(`/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setCommentsCount(data.commentsCount);
        setCommentText('');
        if (onComment) onComment(post._id, data.comment);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      loadComments();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return date.toLocaleDateString();
  };

  const renderCaption = () => {
    if (!post.caption) return null;

    const MAX_LENGTH = 100;
    const needsTruncation = post.caption.length > MAX_LENGTH;
    const displayCaption = needsTruncation && !showFullCaption
      ? post.caption.substring(0, MAX_LENGTH) + '...'
      : post.caption;

    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" component="div">
          <strong>{post.userId?.username}</strong>{' '}
          {displayCaption}
        </Typography>
        {needsTruncation && (
          <Button
            size="small"
            onClick={() => setShowFullCaption(!showFullCaption)}
            sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
          >
            {showFullCaption ? 'Ver menos' : 'Ver más'}
          </Button>
        )}
      </Box>
    );
  };

  const renderHashtags = () => {
    if (!post.hashtags || post.hashtags.length === 0) return null;

    return (
      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {post.hashtags.map((hashtag, index) => (
          <Chip
            key={index}
            label={hashtag}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Card sx={{ 
      maxWidth: 600, 
      mb: 3, 
      mx: 'auto',
      backgroundColor: darkMode ? muiTheme.palette.background.paper : '#ffffff',
      border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
      boxShadow: darkMode ? 'none' : 1,
    }}>
      <CardHeader
        avatar={
          <Avatar
            src={post.userId?.profileImage}
            alt={post.userId?.fullName}
            sx={{ width: 40, height: 40 }}
          >
            {post.userId?.fullName?.[0] || post.userId?.username?.[0]}
          </Avatar>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isOwnPost && (
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                size="small"
                onClick={handleFollow}
                disabled={followLoading}
                startIcon={isFollowing ? <PersonRemove /> : <PersonAdd />}
                sx={{ minWidth: 'auto', textTransform: 'none' }}
              >
                {isFollowing ? 'Siguiendo' : 'Seguir'}
              </Button>
            )}
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle2" component="span">
              {post.userId?.username}
            </Typography>
            {post.userId?.isVerified && (
              <Verified sx={{ fontSize: 16, color: 'primary.main' }} />
            )}
          </Box>
        }
        subheader={
          <Box>
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.createdAt)}
            </Typography>
            {post.location && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                • {post.location}
              </Typography>
            )}
          </Box>
        }
      />

      {/* Imagen del post (opcional) */}
      {post.imageUrl && (
        <CardMedia
          component="img"
          image={post.imageUrl}
          alt="Post image"
          sx={{
            aspectRatio: '1/1',
            objectFit: 'cover'
          }}
        />
      )}

      {/* Contenido de texto para posts sin imagen */}
      {post.content && !post.imageUrl && (
        <CardContent sx={{ py: 2 }}>
          <Typography variant="body1" component="div">
            {post.content}
          </Typography>
        </CardContent>
      )}

      <CardActions disableSpacing sx={{ px: 2, py: 1 }}>
        <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton onClick={toggleComments}>
          <ChatBubbleOutline />
        </IconButton>
        <IconButton>
          <Share />
        </IconButton>
        <Box sx={{ ml: 'auto' }}>
          <IconButton>
            <BookmarkBorder />
          </IconButton>
        </Box>
      </CardActions>

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </Typography>

        {renderCaption()}
        {renderHashtags()}

        {commentsCount > 0 && (
          <Button
            size="small"
            sx={{ mt: 1, p: 0, textTransform: 'none', color: 'text.secondary' }}
            onClick={toggleComments}
            endIcon={showComments ? <ExpandLess /> : <ExpandMore />}
          >
            {showComments ? 'Ocultar' : 'Ver'} {commentsCount} comentario{commentsCount !== 1 ? 's' : ''}
          </Button>
        )}

        {/* Sección de comentarios */}
        <Collapse in={showComments}>
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            {comments.map((comment, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>{comment.author?.username}</strong>{' '}
                  {comment.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(comment.createdAt)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>

        {/* Campo para agregar comentario */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Agrega un comentario..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleComment();
              }
            }}
          />
          <IconButton 
            onClick={handleComment} 
            disabled={!commentText.trim()}
            color="primary"
          >
            <Send />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;
