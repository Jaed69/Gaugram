import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Página no encontrada</h2>
        <p class="error-message">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="goHome()">
            Ir al inicio
          </button>
          <button class="btn btn-outline" (click)="goBack()">
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
      padding: 20px;
    }

    .not-found-content {
      text-align: center;
      max-width: 400px;
    }

    .error-code {
      font-size: 72px;
      font-weight: bold;
      color: #405de6;
      margin: 0;
      line-height: 1;
    }

    .error-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 16px 0 8px 0;
    }

    .error-message {
      font-size: 16px;
      color: #666;
      margin: 0 0 32px 0;
      line-height: 1.5;
    }

    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background: #405de6;
      color: white;
    }

    .btn-primary:hover {
      background: #334bc7;
    }

    .btn-outline {
      background: transparent;
      color: #405de6;
      border: 2px solid #405de6;
    }

    .btn-outline:hover {
      background: #405de6;
      color: white;
    }

    @media (max-width: 480px) {
      .error-code {
        font-size: 56px;
      }

      .error-title {
        font-size: 20px;
      }

      .error-actions {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 200px;
      }
    }
  `],
  standalone: true
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    window.history.back();
  }
}
