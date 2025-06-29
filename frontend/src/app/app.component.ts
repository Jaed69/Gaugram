// frontend/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService, Post } from './services/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  posts: Post[] = [];
  newPostContent: string = '';

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe((data: Post[]) => {
      this.posts = data;
    });
  }

  submitPost() {
    if (this.newPostContent.trim()) {
      const post: Post = { content: this.newPostContent };
      this.postService.addPost(post).subscribe(() => {
        this.newPostContent = '';
        this.loadPosts(); // Recargar los posts después de añadir uno nuevo
      });
    }
  }
}
