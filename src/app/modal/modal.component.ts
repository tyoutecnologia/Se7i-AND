import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      id="modal-backdrop"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        class="bg-white p-6 py-8 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
        style="margin-top: 20px; margin-bottom: 20px; width: 950px;"
      >
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          (click)="closeModal()"
        >
          &times;
        </button>
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() isOpen: boolean = false; // Estado do modal
  @Output() close = new EventEmitter<void>(); // Evento para fechar o modal

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isOpen && target.id === 'modal-backdrop') {
      this.close.emit();
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
