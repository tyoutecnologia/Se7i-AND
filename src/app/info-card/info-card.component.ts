import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css'],
})
export class InfoCardComponent {
  @Input() detranDestino!: string;
  @Input() imagem!: string;
  @Input() funcionario!: string;
  @Input() dataValidacao!: string;
  @Input() horarioValidacao!: string;
  @Input() color!: string;
  @Input() vistoriaId!: string; // ID da vistoria
  @Output() viewDetails = new EventEmitter<string>(); // Emite string

  onViewDetails(): void {
    this.viewDetails.emit(this.vistoriaId); // Emite o ID da vistoria
  }
}
