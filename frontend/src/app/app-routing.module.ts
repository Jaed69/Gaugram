import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

// Import components
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FeedComponent } from './pages/feed/feed.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';

const routes: Routes = [
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

  // Protected routes
  { 
    path: '', 
    component: FeedComponent, 
    canActivate: [AuthGuard],
    title: 'Feed - Gaugram'
  },
  { 
    path: 'create', 
    component: CreatePostComponent, 
    canActivate: [AuthGuard],
    title: 'Nueva Publicación - Gaugram'
  },
  { 
    path: 'profile/:username', 
    component: ProfileComponent, 
    canActivate: [AuthGuard],
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

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
