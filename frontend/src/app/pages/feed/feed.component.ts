import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post';
import { AuthService } from '../../core/services/auth.service';
import { Post, User } from '../../core/models';

@Component({
  selector: 'app-feed',
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
    this.currentUser = this.authService.getCurrentUser();
    this.loadPosts();
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
    const post = this.posts.find(p => p._id === postId);
    if (!post) return;

    this.postService.toggleLike(postId).subscribe({
      next: (response) => {
        post.isLiked = response.isLiked;
        post.likesCount = response.likesCount;
      },
      error: (error: any) => console.error('Error toggling like:', error)
    });
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
