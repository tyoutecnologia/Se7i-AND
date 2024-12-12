import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InfoCardComponent } from '../info-card/info-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aguardando-aprovacao',
  standalone: true,
  imports: [CommonModule, InfoCardComponent],
  templateUrl: './aguardando-aprovacao.component.html',
})
export class AguardandoAprovacaoComponent implements OnInit {
  @Output() viewDetails = new EventEmitter<string>(); // Emite o ID da vistoria

  vistorias: Array<any> = []; // Lista de vistorias
  detranNomes: { [key: string]: string } = {}; // Cache para nomes dos Detrans

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchVistorias();
  }

  fetchVistorias(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token não disponível.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<
        any[]
      >('http://se7i2.ddns.net:3090/vistorias/filtro-avancado?status_aprovacao=EM_ANALISE', { headers })
      .subscribe({
        next: (response) => {
          this.vistorias = response;
          this.vistorias.forEach((vistoria) => {
            this.fetchDetranNome(vistoria.detran_destino_id);
          });
        },
        error: (error) => {
          console.error('Erro ao buscar vistorias:', error);
        },
      });
  }

  fetchDetranNome(detranId: string): void {
    if (this.detranNomes[detranId]) {
      return; // Já temos o nome em cache
    }

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<{
        razao_social: string;
      }>(`http://se7i2.ddns.net:3090/detrans/${detranId}`, { headers })
      .subscribe({
        next: (response) => {
          this.detranNomes[detranId] = response.razao_social;
        },
        error: (error) => {
          console.error(
            `Erro ao buscar o nome do Detran (${detranId}):`,
            error,
          );
        },
      });
  }

  getDetranNome(detranId: string): string {
    return this.detranNomes[detranId] || 'Carregando...';
  }

  onViewDetails(id: string): void {
    this.viewDetails.emit(id); 
  }
}
