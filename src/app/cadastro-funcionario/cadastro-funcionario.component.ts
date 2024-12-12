import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastro-funcionario',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-funcionario.component.html',
  styleUrls: ['./cadastro-funcionario.component.css'],
})
export class CadastroFuncionarioComponent {
  nome: string = '';
  cpf: string = '';
  email: string = '';
  senha: string = '';
  telefone: string = '';
  isLoading: boolean = false; // Estado de carregamento

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {}

  onSubmit(): void {
    this.isLoading = true; // Ativa o estado de carregamento

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.toastr.error(
        'Token não encontrado. Por favor, faça login novamente.',
        'Erro de autenticação',
      );
      this.isLoading = false; // Desativa o estado de carregamento
      return;
    }

    const payload = {
      nome: this.nome,
      cpf: this.cpf.replace(/\D/g, ''), // Remove a máscara do CPF
      email: this.email,
      senha: this.senha,
      telefone: this.telefone.replace(/\D/g, ''), // Remove a máscara do telefone
      receber_notificacoes: true,
      cargo: 'Operador',
      numero_credenciamento: '12345',
      posto_vistoria_id: 'bbb596a5-599d-4cd0-96bc-f8d2d72c190e',
      papeis: ['OPERADOR_POSTO_VISTORIA'],
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http
      .post('http://se7i2.ddns.net:3090/usuarios', payload, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Funcionário cadastrado com sucesso!', 'Sucesso');
          this.isLoading = false; // Desativa o estado de carregamento
          this.resetForm(); // Reseta o formulário após o sucesso
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          this.toastr.error(
            'Erro ao cadastrar funcionário. Tente novamente.',
            'Erro',
          );
          this.isLoading = false; // Desativa o estado de carregamento
        },
      });
  }

  resetForm(): void {
    this.nome = '';
    this.cpf = '';
    this.email = '';
    this.senha = '';
    this.telefone = '';
  }
}
