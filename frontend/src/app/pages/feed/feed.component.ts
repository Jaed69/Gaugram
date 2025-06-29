import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post';
import { AuthService } from '../../core/services/auth.service';
import { Post, User } from '../../core/models';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  loading = false;
  hasMore = true;
  currentUser: User | null = null;
  page = 1;
  limit = 10;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Para demostración, cargar datos de prueba inmediatamente
    this.loadMockData();
    
    // También intentar cargar datos reales si hay autenticación
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadPosts();
    }
  }

  loadMockData() {
    // Datos de prueba que se ven como Instagram
    this.posts = [
      {
        _id: '1',
        userId: {
          id: 'user1',
          username: 'nature_lover',
          email: 'nature@example.com',
          fullName: 'Ana García',
          bio: 'Amante de la naturaleza 🌿',
          profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b732?w=150&h=150&fit=crop&crop=face',
          isVerified: false,
          isPrivate: false,
          followersCount: 1204,
          followingCount: 892,
          postsCount: 45,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
        caption: 'Increíble atardecer en las montañas 🏔️ #naturaleza #aventura #hiking',
        hashtags: ['naturaleza', 'aventura', 'hiking'],
        location: 'Parque Nacional Ordesa',
        likesCount: 234,
        commentsCount: 12,
        isLiked: false,
        isActive: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        _id: '2',
        userId: {
          id: 'user2',
          username: 'foodie_madrid',
          email: 'foodie@example.com',
          fullName: 'Carlos Ruiz',
          bio: 'Chef & Food Blogger 👨‍🍳',
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          isVerified: true,
          isPrivate: false,
          followersCount: 5420,
          followingCount: 321,
          postsCount: 128,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=600&fit=crop',
        caption: 'Nueva receta en el blog! 🍕 Pizza casera con masa madre. El secreto está en los ingredientes frescos y mucho amor ❤️',
        hashtags: ['pizza', 'comida', 'recetas', 'casero'],
        location: 'Madrid, España',
        likesCount: 892,
        commentsCount: 45,
        isLiked: true,
        isActive: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        _id: '3',
        userId: {
          id: 'user3',
          username: 'travel_diary',
          email: 'travel@example.com',
          fullName: 'María López',
          bio: 'Explorando el mundo 🌍 ✈️',
          profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          isVerified: false,
          isPrivate: false,
          followersCount: 2156,
          followingCount: 1543,
          postsCount: 87,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
        caption: 'Santorini nunca deja de sorprenderme 💙 Cada rincón es una postal perfecta',
        hashtags: ['santorini', 'grecia', 'viajes', 'mar'],
        location: 'Santorini, Grecia',
        likesCount: 1543,
        commentsCount: 78,
        isLiked: false,
        isActive: true,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
  }

  loadPosts(loadMore = false) {
    if (this.loading) return;
    
    this.loading = true;
    const pageToLoad = loadMore ? this.page + 1 : 1;

    this.postService.getFeed(pageToLoad, this.limit).subscribe({
      next: (response) => {
        if (loadMore) {
          this.posts = [...this.posts, ...response.posts];
          this.page = pageToLoad;
        } else {
          this.posts = response.posts;
          this.page = 1;
        }
        
        this.hasMore = response.pagination.hasMore;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    });
  }

  onLoadMore() {
    if (this.hasMore && !this.loading) {
      this.loadPosts(true);
    }
  }

  onLikePost(postId: string) {
    // Toggle like status for demo
    const post = this.posts.find(p => p._id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
    }
    
    // In real app, call API
    // this.postService.toggleLike(postId).subscribe(...)
  }

  onSharePost(postId: string) {
    // Share functionality
    console.log('Sharing post:', postId);
  }

  onSavePost(postId: string) {
    // Save/bookmark functionality
    console.log('Saving post:', postId);
  }

  onRefresh() {
    this.loadPosts();
  }

  trackByPostId(index: number, post: Post): string {
    return post._id;
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace unos segundos';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} d`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 604800)} sem`;
    
    return postDate.toLocaleDateString();
  }
}
