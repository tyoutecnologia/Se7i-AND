import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService, // Serviço de toast
  ) {}

  onSubmit() {
    this.authService.login(this.email, this.senha).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido!', response);
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.toastr.error('Credenciais inválidas. Tente novamente.', 'Erro');
      },
    });
  }
}
