import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-criar-servico-form',
  standalone: true,
  imports: [FormsModule, CommonModule], // Adicionar CommonModule aqui
  templateUrl: './criar-servico-form.component.html',
  styleUrls: ['./criar-servico-form.component.css'],
})
export class CriarServicoFormComponent {
  descricao: string = '';
  valor: number | null = null;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  onSubmit(): void {
    if (!this.descricao || this.valor === null) {
      this.toastr.warning('Preencha todos os campos.', 'Aviso');
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const payload = {
      descricao: this.descricao,
      valor: this.valor,
    };

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.toastr.error('Token não encontrado. Faça login novamente.', 'Erro');
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http
      .post('http://se7i2.ddns.net:3090/servicos', payload, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Serviço cadastrado com sucesso!', 'Sucesso');
          this.isLoading = false;
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao cadastrar o serviço:', error);
          this.toastr.error(
            'Erro ao cadastrar o serviço. Tente novamente.',
            'Erro',
          );
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  resetForm(): void {
    this.descricao = '';
    this.valor = null;
    this.cdr.detectChanges();
  }
}
