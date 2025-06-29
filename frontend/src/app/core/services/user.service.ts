import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = '/api/users';

  constructor(private http: HttpClient) {}

  // Buscar usuarios
  searchUsers(query: string, page: number = 1): Observable<{ users: User[]; pagination: any }> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString());

    return this.http.get<{ users: User[]; pagination: any }>(`${this.API_URL}/search`, { params });
  }

  // Obtener perfil de usuario por username
  getUserProfile(username: string): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.API_URL}/${username}`);
  }

  // Seguir/dejar de seguir usuario
  toggleFollow(username: string): Observable<{ message: string; isFollowing: boolean; followersCount: number }> {
    return this.http.post<{ message: string; isFollowing: boolean; followersCount: number }>(`${this.API_URL}/${username}/follow`, {});
  }

  // Obtener seguidores de un usuario
  getFollowers(username: string, page: number = 1): Observable<{ followers: User[]; pagination: any }> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<{ followers: User[]; pagination: any }>(`${this.API_URL}/${username}/followers`, { params });
  }

  // Obtener usuarios seguidos
  getFollowing(username: string, page: number = 1): Observable<{ following: User[]; pagination: any }> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<{ following: User[]; pagination: any }>(`${this.API_URL}/${username}/following`, { params });
  }

  // Obtener usuarios sugeridos
  getSuggestedUsers(limit: number = 10): Observable<{ suggestedUsers: User[] }> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<{ suggestedUsers: User[] }>(`${this.API_URL}/suggestions`, { params });
  }
}
