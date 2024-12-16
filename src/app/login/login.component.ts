import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  isLoading: boolean = false; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef, 
  ) {}

  onSubmit(): void {
    if (this.isLoading) return; 

    this.isLoading = true;
    this.cdr.detectChanges(); 

    this.authService.login(this.email, this.senha).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido!', response);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.toastr.error('Credenciais inválidas. Tente novamente.', 'Erro');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
