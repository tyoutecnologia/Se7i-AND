import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service'; // Importar AuthService

@Component({
  selector: 'app-visualizacao-vistoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizar-vistoria.component.html',
  styleUrls: ['./visualizar-vistoria.component.css'],
})
export class VisualizacaoVistoriaComponent implements OnChanges {
  @Input() vistoriaId!: string;
  @Output() back = new EventEmitter<void>();

  municipioOrigem: string = '';
  statusLaudo: string = '';
  nomeProprietario: string = '';
  municipioProprietario: string = '';
  dataLaudo: string = '';
  horaLaudo: string = '';
  placa: string = '';
  chassi: string = '';
  motor: string = '';
  marcaModelo: string = '';
  cor: string = '';
  documentoUrl: string = '';
  statusAprovacao: string = '';
  isOperadorCiretran: boolean = false; // Flag para verificar role do usuário

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService, // Injetar AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vistoriaId'] && changes['vistoriaId'].currentValue) {
      this.fetchVistoriaDetails();
    }
  }

  ngOnInit(): void {
    this.checkRole();
  }

  fetchVistoriaDetails(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.toastr.error('Token não encontrado. Faça login novamente.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`http://se7i2.ddns.net:3090/vistorias/${this.vistoriaId}`, {
        headers,
      })
      .subscribe({
        next: (response) => {
          this.municipioOrigem = `${response.municipio_proprietario} - ${response.uf_proprietario}`;
          this.statusLaudo = response.status_laudo;
          this.nomeProprietario = response.nome_proprietario;
          this.municipioProprietario = response.municipio_proprietario;
          this.dataLaudo = new Date(response.data_laudo).toLocaleDateString();
          this.horaLaudo = response.hora_laudo;
          this.placa = response.placa;
          this.chassi = response.chassi;
          this.motor = response.motor;
          this.marcaModelo = response.marca_modelo;
          this.cor = response.cor_veiculo;
          this.documentoUrl = response.arquivos[0]?.caminho_arquivo || '';
          this.statusAprovacao = response.status_aprovacao;
        },
        error: (error) => {
          console.error('Erro ao buscar detalhes da vistoria:', error);
        },
      });
  }

  atualizarStatusAprovacao(status: string): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.toastr.error('Token não encontrado. Faça login novamente.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      status_aprovacao: status,
    };

    this.http
      .patch(
        `http://se7i2.ddns.net:3090/vistorias/${this.vistoriaId}/status-aprovacao`,
        body,
        { headers },
      )
      .subscribe({
        next: () => {
          this.toastr.success(
            `Vistoria ${status === 'APROVADA' ? 'aprovada' : 'recusada'} com sucesso!`,
          );
          this.statusAprovacao = status;
        },
        error: (error) => {
          console.error('Erro ao atualizar status da vistoria:', error);
          this.toastr.error('Erro ao atualizar o status. Tente novamente.');
        },
      });
  }

  iniciarAprovacao(): void {
    this.atualizarStatusAprovacao('APROVADA');
  }

  iniciarRecusa(): void {
    this.atualizarStatusAprovacao('RECUSADA');
  }

  checkRole(): void {
    const roles = this.authService.getRoles();
    this.isOperadorCiretran = roles?.includes('OPERADOR_CIRETRAN') || false;
  }

  onBack(): void {
    this.back.emit();
  }
}
