import { Component, OnInit } from '@angular/core';
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
export class CadastroFuncionarioComponent implements OnInit {
  nome: string = '';
  cpf: string = '';
  email: string = '';
  senha: string = '';
  telefone: string = '';
  isLoading: boolean = false;
  titulo: string = 'Cadastro de Funcionário';
  role: string = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = user.papeis?.[0] || '';
    this.definirTitulo();
  }

  definirTitulo(): void {
    if (this.role === 'ADMIN') {
      this.titulo = 'Cadastro de Usuário AND';
    } else if (this.role === 'OPERADOR_CIRETRAN') {
      this.titulo = 'Cadastro de Agente';
    } else if (this.role === 'OPERADOR_POSTO_VISTORIA') {
      this.titulo = 'Cadastro de Funcionário';
    }
  }

  onSubmit(): void {
    this.isLoading = true;

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.toastr.error(
        'Token não encontrado. Por favor, faça login novamente.',
        'Erro',
      );
      this.isLoading = false;
      return;
    }

    const payload = {
      nome: this.nome,
      cpf: this.cpf.replace(/\D/g, ''),
      email: this.email,
      senha: this.senha,
      telefone: this.telefone.replace(/\D/g, ''),
      receber_notificacoes: true,
      cargo: this.role === 'ADMIN' ? 'Admin' : 'Operador',
      numero_credenciamento: '12345',
      posto_vistoria_id: 'bbb596a5-599d-4cd0-96bc-f8d2d72c190e',
      papeis: [this.role],
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http
      .post('http://se7i2.ddns.net:3090/usuarios', payload, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Usuário cadastrado com sucesso!', 'Sucesso');
          this.isLoading = false;
          this.resetForm();
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          this.toastr.error(
            'Erro ao cadastrar funcionário. Tente novamente.',
            'Erro',
          );
          this.isLoading = false;
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
