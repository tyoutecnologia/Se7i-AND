import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-visualizacao-vistoria',
  standalone: true,
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

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vistoriaId'] && changes['vistoriaId'].currentValue) {
      this.fetchVistoriaDetails();
    }
  }

  fetchVistoriaDetails(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token not found.');
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
        },
        error: (error) => {
          console.error('Failed to fetch vistoria details:', error);
        },
      });
  }

  onBack(): void {
    this.back.emit();
  }
}
