import { Routes } from '@angular/router';

// Import components
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FeedComponent } from './pages/feed/feed.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';

export const routes: Routes = [
  // Public routes
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Iniciar Sesión - Gaugram'
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    title: 'Crear Cuenta - Gaugram'
  },

  // Main routes (temporarily removing auth guard for development)
  { 
    path: '', 
    component: FeedComponent, 
    title: 'Feed - Gaugram'
  },
  { 
    path: 'create', 
    component: CreatePostComponent, 
    title: 'Nueva Publicación - Gaugram'
  },
  { 
    path: 'profile/:username', 
    component: ProfileComponent, 
    title: 'Perfil - Gaugram'
  },

  // Fallback routes
  { 
    path: '404', 
    loadComponent: () => import('./components/not-found/not-found.component').then(c => c.NotFoundComponent),
    title: 'Página no encontrada - Gaugram'
  },
  { 
    path: '**', 
    redirectTo: '/404'
  }
];
