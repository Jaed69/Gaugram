import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { PostService } from '../../services/post';
import { AuthService } from '../../core/services/auth.service';
import { User, Post } from '../../core/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  posts: Post[] = [];
  currentUser: User | null = null;
  username: string = '';
  loading = false;
  postsLoading = false;
  isOwnProfile = false;
  isFollowing = false;
  followLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username') || '';
      if (this.username) {
        this.loadProfile();
        this.loadUserPosts();
      }
    });
  }

  loadProfile() {
    this.loading = true;
    
    this.userService.getUserProfile(this.username).subscribe({
      next: (response) => {
        this.user = response.user;
        this.isOwnProfile = this.currentUser?.username === this.username;
        this.isFollowing = this.user?.isFollowing || false;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.loading = false;
        if (error.status === 404) {
          this.router.navigate(['/404']);
        }
      }
    });
  }

  loadUserPosts() {
    this.postsLoading = true;
    
    this.postService.getUserPosts(this.username).subscribe({
      next: (response) => {
        this.posts = response.posts;
        this.postsLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user posts:', error);
        this.postsLoading = false;
      }
    });
  }

  onFollowToggle() {
    if (!this.user || this.followLoading) return;
    
    this.followLoading = true;
    
    const action = this.isFollowing ? 'unfollow' : 'follow';
    
    this.userService.toggleFollow(this.user.username).subscribe({
      next: (response) => {
        this.isFollowing = response.isFollowing;
        if (this.user) {
          this.user.followersCount = response.followersCount;
          this.user.isFollowing = response.isFollowing;
        }
        this.followLoading = false;
      },
      error: (error: any) => {
        console.error(`Error ${action}ing user:`, error);
        this.followLoading = false;
      }
    });
  }

  onEditProfile() {
    this.router.navigate(['/settings/profile']);
  }

  onPostClick(post: Post) {
    this.router.navigate(['/post', post._id]);
  }

  getGridCols(): number {
    return window.innerWidth < 768 ? 3 : 3;
  }

  trackByPostId(index: number, post: Post): string {
    return post._id;
  }
}
