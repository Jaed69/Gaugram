import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, CreatePostRequest, PaginatedResponse } from '../core/models';

// Re-export Post for components that import from this service
export type { Post } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly API_URL = '/api/posts';

  constructor(private http: HttpClient) {}

  // Obtener feed de posts
  getFeed(page: number = 1, limit: number = 10): Observable<{ posts: Post[]; pagination: any }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<{ posts: Post[]; pagination: any }>(`${this.API_URL}/feed`, { params });
  }

  // Crear nuevo post
  createPost(postData: CreatePostRequest): Observable<{ message: string; post: Post }> {
    return this.http.post<{ message: string; post: Post }>(this.API_URL, postData);
  }

  // Obtener posts de un usuario específico
  getUserPosts(username: string, page: number = 1, limit: number = 12): Observable<{ posts: Post[]; pagination: any }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<{ posts: Post[]; pagination: any }>(`${this.API_URL}/user/${username}`, { params });
  }

  // Obtener un post específico
  getPost(postId: string): Observable<{ post: Post; comments: any[] }> {
    return this.http.get<{ post: Post; comments: any[] }>(`${this.API_URL}/${postId}`);
  }

  // Dar/quitar like a un post
  toggleLike(postId: string): Observable<{ message: string; isLiked: boolean; likesCount: number }> {
    return this.http.post<{ message: string; isLiked: boolean; likesCount: number }>(`${this.API_URL}/${postId}/like`, {});
  }

  // Eliminar post
  deletePost(postId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${postId}`);
  }

  // Obtener todos los posts (para app.component.ts compatibility)
  getPosts(page: number = 1, limit: number = 10): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}?page=${page}&limit=${limit}`);
  }

  // Agregar post (para app.component.ts compatibility)
  addPost(post: CreatePostRequest): Observable<{ message: string; post: Post }> {
    return this.createPost(post);
  }

  // Buscar posts por hashtag
  searchByHashtag(hashtag: string, page: number = 1): Observable<{ posts: Post[]; pagination: any }> {
    const params = new HttpParams()
      .set('hashtag', hashtag)
      .set('page', page.toString());

    return this.http.get<{ posts: Post[]; pagination: any }>(`${this.API_URL}/hashtag`, { params });
  }
}
