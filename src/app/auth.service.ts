import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router'; // Importe o Router

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://se7i2.ddns.net:3090';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {} // Injeção do Router

  login(email: string, senha: string): Observable<any> {
    const payload = { email, senha };
    return this.http.post(`${this.apiUrl}/auth/login`, payload).pipe(
      tap((response: any) => {
        if (this.isBrowser()) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('roles', JSON.stringify(response.user.papeis)); // Armazena os papéis no localStorage
        }
        this.currentUserSubject.next(response.user);
      }),
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('roles'); // Remove os papéis
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']); // Redireciona para o login
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  getUser(): any {
    if (this.isBrowser()) {
      return JSON.parse(localStorage.getItem('user') || 'null');
    }
    return null;
  }

  getRoles(): string[] | null {
    if (this.isBrowser()) {
      return JSON.parse(localStorage.getItem('roles') || 'null');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
