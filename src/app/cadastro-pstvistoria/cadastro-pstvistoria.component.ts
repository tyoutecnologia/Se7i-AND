import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastro-pstvistoria',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-pstvistoria.component.html',
})
export class CadastroPstvistoriaComponent {
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
  numeroCredenciamento: string = ''; // Novo campo
  estados: Array<{ id: string; nome: string; sigla: string }> = [];
  municipios: Array<{ id: string; nome: string }> = [];
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
        this.selectedEstado = '';
        this.selectedMunicipio = '';
        this.municipios = [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar estados.');
        console.error(error);
      },
    });
  }

  onEstadoChange(): void {
    this.selectedMunicipio = '';
    this.municipios = [];
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
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar municípios.');
          console.error(error);
        },
      });
  }

  onCepChange(): void {
    const cleanCep = this.cep.replace(/\D/g, ''); // Remove a máscara do CEP
    if (cleanCep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cleanCep}/json/`).subscribe({
        next: (response: any) => {
          if (response.erro) {
            this.toastr.error('CEP não encontrado.');
          } else {
            this.rua = response.logradouro || '';
            this.bairro = response.bairro || '';
            this.toastr.success('Endereço carregado pelo CEP.');
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Erro ao buscar o endereço:', error);
          this.toastr.error('Erro ao buscar o endereço. Verifique o CEP.');
        },
      });
    } else if (cleanCep.length > 0 && cleanCep.length < 8) {
      this.toastr.warning('CEP incompleto.');
    }
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
      numero_credenciamento: this.numeroCredenciamento, // Inclui no payload
      endereco: {
        rua: this.rua,
        numero: Number(this.numero),
        bairro: this.bairro,
        complemento: this.complemento,
        cep: this.cep.replace(/\D/g, ''),
        cidade_id: this.selectedMunicipio,
        estado_id: this.selectedEstado,
      },
    };

    const headers = this.getAuthHeaders();
    this.http
      .post('http://se7i2.ddns.net:3090/postos-vistoria', payload, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Posto de Vistoria cadastrado com sucesso!');
          this.isLoading = false;
          this.resetForm();
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(
            'Erro ao cadastrar o posto de vistoria. Tente novamente.',
          );
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
      this.selectedMunicipio.trim() !== '' &&
      this.numeroCredenciamento.trim() !== ''
    );
  }

  resetForm(): void {
    this.razaoSocial = '';
    this.nomeFantasia = '';
    this.cnpj = '';
    this.telefone = '';
    this.email = '';
    this.observacao = '';
    this.rua = '';
    this.numero = '';
    this.bairro = '';
    this.complemento = '';
    this.cep = '';
    this.numeroCredenciamento = '';
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
