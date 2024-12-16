import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    const token = this.authService.getToken();

    if (token && this.isTokenValid(token)) {
      return true;
    }

    // Redireciona para a página de login se o token for inválido ou inexistente
    return this.router.createUrlTree(['/login']);
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now; // Verifica se o token expirou
    } catch (error) {
      console.error('Erro ao validar o token:', error);
      return false;
    }
  }
}
