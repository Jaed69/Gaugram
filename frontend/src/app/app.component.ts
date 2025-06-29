// frontend/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Gaugram';
  currentUser: User | null = null;
  isAuthenticated = false;
  searchQuery = '';
  searchResults: User[] = [];
  showProfileMenu = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Para desarrollo, simular usuario autenticado para mostrar la UI
    this.isAuthenticated = true;
    this.currentUser = {
      id: 'demo-user',
      username: 'demo_user',
      email: 'demo@gaugram.com',
      fullName: 'Usuario Demo',
      bio: 'Cuenta de demostración',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      isVerified: false,
      isPrivate: false,
      followersCount: 150,
      followingCount: 89,
      postsCount: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Verificar si hay un usuario real autenticado
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });

    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.isAuthenticated = isAuth;
      }
    });
  }

  onSearch() {
    // Placeholder for search functionality
    console.log('Searching for:', this.searchQuery);
  }

  navigateToProfile(username: string) {
    this.router.navigate(['/profile', username]);
    this.searchResults = [];
    this.searchQuery = '';
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.authService.logout();
    this.showProfileMenu = false;
  }

  onLogout() {
    this.logout();
  }
}
