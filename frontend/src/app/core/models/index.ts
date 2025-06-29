// Modelo de Usuario
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profileImage: string;
  isVerified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  followsYou?: boolean;
  isOwnProfile?: boolean;
  canViewPosts?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo de Post
export interface Post {
  _id: string;
  userId: User;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo de Comentario
export interface Comment {
  _id: string;
  postId: string;
  userId: User;
  text: string;
  likesCount: number;
  isLiked?: boolean;
  parentComment?: string;
  replies?: Comment[];
  repliesCount?: number;
  hasMoreReplies?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo de Notificación
export interface Notification {
  _id: string;
  recipientId: string;
  senderId: User;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'comment_reply';
  postId?: Post;
  commentId?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Respuesta de autenticación
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Respuesta genérica de la API
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  errors?: string[];
}

// Paginación
export interface Pagination {
  page: number;
  limit: number;
  hasMore: boolean;
}

// Respuesta con paginación
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Request para crear post
export interface CreatePostRequest {
  imageUrl: string;
  caption?: string;
  location?: string;
}

// Request para registro
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

// Request para login
export interface LoginRequest {
  login: string; // puede ser email o username
  password: string;
}

// Request para actualizar perfil
export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  isPrivate?: boolean;
}

// Request para comentario
export interface CreateCommentRequest {
  text: string;
  parentComment?: string;
}
