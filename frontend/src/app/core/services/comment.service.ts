import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreateCommentRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly API_URL = '/api/comments';

  constructor(private http: HttpClient) {}

  // Crear comentario
  createComment(postId: string, commentData: CreateCommentRequest): Observable<{ message: string; comment: Comment }> {
    return this.http.post<{ message: string; comment: Comment }>(`${this.API_URL}/post/${postId}`, commentData);
  }

  // Obtener comentarios de un post
  getComments(postId: string, page: number = 1): Observable<{ comments: Comment[]; pagination: any }> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<{ comments: Comment[]; pagination: any }>(`${this.API_URL}/post/${postId}`, { params });
  }

  // Obtener respuestas de un comentario
  getReplies(commentId: string, page: number = 1): Observable<{ replies: Comment[]; pagination: any }> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<{ replies: Comment[]; pagination: any }>(`${this.API_URL}/${commentId}/replies`, { params });
  }

  // Dar/quitar like a un comentario
  toggleCommentLike(commentId: string): Observable<{ message: string; isLiked: boolean; likesCount: number }> {
    return this.http.post<{ message: string; isLiked: boolean; likesCount: number }>(`${this.API_URL}/${commentId}/like`, {});
  }

  // Eliminar comentario
  deleteComment(commentId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${commentId}`);
  }
}
