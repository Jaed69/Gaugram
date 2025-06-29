import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse, RegisterRequest, LoginRequest, UpdateProfileRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'gaugram_token';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTokenFromStorage();
  }

  // Registro de usuario
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  // Inicio de sesión
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  // Obtener perfil del usuario actual
  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.API_URL}/profile`)
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  // Actualizar perfil
  updateProfile(profileData: UpdateProfileRequest): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.API_URL}/profile`, profileData)
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
        })
      );
  }

  // Cerrar sesión
  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Obtener token de autenticación
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Verificar si el token no ha expirado
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Obtener ID del usuario actual
  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  // Manejar éxito de autenticación
  private handleAuthSuccess(response: AuthResponse): void {
    this.setToken(response.token);
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  // Guardar token
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Eliminar token
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Cargar token desde localStorage al inicializar
  private loadTokenFromStorage(): void {
    if (this.isAuthenticated()) {
      this.isAuthenticatedSubject.next(true);
      // Cargar perfil del usuario
      this.getProfile().subscribe({
        error: () => {
          // Si hay error cargando el perfil, hacer logout
          this.logout();
        }
      });
    }
  }
}
