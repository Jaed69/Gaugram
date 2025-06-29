import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  _id?: string;
  content: string;
  author?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // La URL apunta a nuestra API. Docker la hará accesible.
  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }
}
