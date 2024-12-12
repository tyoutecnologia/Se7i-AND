import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AguardandoAprovacaoComponent } from '../aguardando-aprovacao/aguardando-aprovacao.component';
import { RecusadasComponent } from '../recusadas/recusadas.component';
import { EnviadasComponent } from '../enviadas/enviadas.component';
import { ModalComponent } from '../modal/modal.component';
import { VisualizacaoVistoriaComponent } from '../visualizar-vistoria/visualizar-vistoria.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, // Necessário para usar *ngIf, *ngFor, etc.
    AguardandoAprovacaoComponent,
    RecusadasComponent,
    EnviadasComponent,
    ModalComponent,
    VisualizacaoVistoriaComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  isModalOpen: boolean = false; // Estado do modal
  selectedVistoriaId!: string; // ID da vistoria selecionada

  openModal(id: string): void {
    this.selectedVistoriaId = id;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
