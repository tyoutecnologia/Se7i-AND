import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cadastro-ciretran',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-ciretran.component.html',
  styleUrls: ['./cadastro-ciretran.component.css'],
})
export class CadastroCiretranComponent {
  isLoading: boolean = false;
  nome = '';
  email = '';
  telefone = '';
  observacao = '';
  rua = '';
  numero = '';
  bairro = '';
  complemento = '';
  cep = '';
  usuarioId: string = '';
  estadoId: string = '';
  municipioId: string = '';
  municipios: Array<{ id: string; nome: string }> = [];

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.authService.getUser()?.id || '';
    this.fetchEstadoAndMunicipios();
  }

  fetchEstadoAndMunicipios(): void {
    this.http
      .get(`http://se7i2.ddns.net:3090/detrans/${this.usuarioId}`)
      .subscribe({
        next: (response: any) => {
          this.estadoId = response.endereco.estado_id;
          this.fetchMunicipios(this.estadoId);
        },
        error: (error) => {
          console.error('Erro ao buscar estado:', error);
          this.toastr.error('Erro ao buscar estado.');
        },
      });
  }

  fetchMunicipios(estadoId: string): void {
    this.http.get(`http://se7i2.ddns.net:3090/cidades/${estadoId}`).subscribe({
      next: (response: any) => {
        this.municipios = response;
      },
      error: (error) => {
        console.error('Erro ao buscar municípios:', error);
        this.toastr.error('Erro ao buscar municípios.');
      },
    });
  }

  onSubmit(): void {
    this.isLoading = true;

    const payload = {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone.replace(/\D/g, ''),
      observacao: this.observacao,
      id_detran: this.usuarioId,
      endereco: {
        rua: this.rua,
        numero: this.numero,
        bairro: this.bairro,
        complemento: this.complemento,
        cep: this.cep.replace(/\D/g, ''),
        cidade_id: this.municipioId,
        estado_id: this.estadoId,
      },
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });

    this.http
      .post('http://se7i2.ddns.net:3090/ciretrans', payload, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Ciretran cadastrada com sucesso!');
          this.isLoading = false;
          this.resetForm();
        },
        error: (error) => {
          this.toastr.error('Erro ao cadastrar Ciretran. Tente novamente.');
          console.error(error);
          this.isLoading = false;
        },
      });
  }

  onCepChange(): void {
    const cleanCep = this.cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cleanCep}/json/`).subscribe({
        next: (response: any) => {
          if (response.erro) {
            this.toastr.error('CEP não encontrado.');
          } else {
            this.rua = response.logradouro;
            this.bairro = response.bairro;
          }
        },
        error: (error) => {
          console.error('Erro ao buscar o endereço:', error);
          this.toastr.error('Erro ao buscar o endereço. Verifique o CEP.');
        },
      });
    }
  }

  resetForm(): void {
    this.nome = '';
    this.email = '';
    this.telefone = '';
    this.observacao = '';
    this.rua = '';
    this.numero = '';
    this.bairro = '';
    this.complemento = '';
    this.cep = '';
    this.municipioId = '';
  }
}
