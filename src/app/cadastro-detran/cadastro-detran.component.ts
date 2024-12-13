import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro-detran',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-detran.component.html',
  styleUrls: ['./cadastro-detran.component.css'],
})
export class CadastroDetranComponent {
  isLoading: boolean = false;
  razaoSocial: string = '';
  nomeFantasia: string = '';
  cnpj: string = '';
  telefone: string = '';
  rua: string = '';
  email: string = '';
  numero: string = '';
  bairro: string = '';
  cep: string = '';
  complemento: string = '';
  selectedEstado: string = '';
  selectedMunicipio: string = '';
  estados: Array<{ id: string; nome: string; sigla: string }> = [];
  municipios: Array<{ id: string; nome: string; estado_id: string }> = [];
  observacao: string = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEstados();
  }

  loadEstados(): void {
    const headers = this.getAuthHeaders();
    this.http.get('http://se7i2.ddns.net:3090/estados', { headers }).subscribe({
      next: (response: any) => {
        this.estados = response;
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar estados.');
        console.error(error);
      },
    });
  }

  onEstadoChange(): void {
    this.municipios = [];
    this.selectedMunicipio = '';
    if (this.selectedEstado) {
      this.loadMunicipios(this.selectedEstado);
    }
    this.cdr.detectChanges();
  }

  loadMunicipios(estadoId: string): void {
    const headers = this.getAuthHeaders();
    this.http
      .get(`http://se7i2.ddns.net:3090/cidades/${estadoId}`, { headers })
      .subscribe({
        next: (response: any) => {
          this.municipios = response;
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar municípios.');
          console.error(error);
        },
      });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      this.toastr.error('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;

    const payload = {
      razao_social: this.razaoSocial,
      email: this.email,
      nome_fantasia: this.nomeFantasia,
      cnpj: this.cnpj.replace(/\D/g, ''),
      telefone: this.telefone.replace(/\D/g, ''),
      observacao: this.observacao,
      endereco: {
        rua: this.rua,
        numero: this.numero,
        bairro: this.bairro,
        complemento: this.complemento,
        cep: this.cep.replace(/\D/g, ''),
        cidade_id: this.selectedMunicipio,
        estado_id: this.selectedEstado,
      },
    };

    const headers = this.getAuthHeaders();
    this.http
      .post('http://se7i2.ddns.net:3090/detrans', payload, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Detran cadastrado com sucesso!');
          this.isLoading = false;
          this.resetForm();
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Erro ao cadastrar o Detran. Tente novamente.');
          this.isLoading = false;
        },
      });
  }

  validateForm(): boolean {
    return (
      this.razaoSocial.trim() !== '' &&
      this.nomeFantasia.trim() !== '' &&
      this.cnpj.trim() !== '' &&
      this.telefone.trim() !== '' &&
      this.email.trim() !== '' &&
      this.selectedEstado.trim() !== '' &&
      this.selectedMunicipio.trim() !== ''
    );
  }

  resetForm(): void {
    this.razaoSocial = '';
    this.nomeFantasia = '';
    this.cnpj = '';
    this.telefone = '';
    this.email = '';
    this.observacao = '';
    this.selectedEstado = '';
    this.selectedMunicipio = '';
    this.municipios = [];
    this.cdr.detectChanges();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.toastr.error('Token não encontrado. Faça login novamente.');
      throw new Error('Token não encontrado');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
